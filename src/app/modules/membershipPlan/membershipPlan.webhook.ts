// import { stripe } from "../../config/stripe.config";
// import { prisma } from "../../config/prisma";
// import dbConfig from "../../config/db.config";

// export const handleSubscriptionWebhook = async (
//   signature: string,
//   body: Buffer,
// ) => {
//   const event = stripe.webhooks.constructEvent(
//     body,
//     signature,
//     dbConfig.stripe.stripe_webhook_secret,
//   );

//   // 1️⃣ Checkout session completed → create/update membership + add coins
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;
//     if (session.mode !== "subscription") return;

//     const { userId, transactionId, planId } = session.metadata || {};
//     if (!userId || !transactionId || !planId) return;

//     const subscription = await stripe.subscriptions.retrieve(
//       session.subscription as string,
//     );
//     const plan = await prisma.membershipPlan.findUnique({
//       where: { id: planId },
//     });
//     if (!plan) return;

//     await prisma.$transaction(async (tx) => {
//       await tx.membership.upsert({
//         where: { userId },
//         update: {
//           planId,
//           status: "ACTIVE",
//           startDate: new Date(),
//           endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
//           monthlyCoins: plan.monthlyCoins,
//           coinsRemaining: plan.monthlyCoins,
//           stripeSubscriptionId: subscription.id,
//         },
//         create: {
//           userId,
//           planId,
//           status: "ACTIVE",
//           startDate: new Date(),
//           endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
//           monthlyCoins: plan.monthlyCoins,
//           coinsRemaining: plan.monthlyCoins,
//           stripeSubscriptionId: subscription.id,
//         },
//       });

//       await tx.transaction.update({
//         where: { id: transactionId },
//         data: { status: "PAID", stripeSessionId: session.id },
//       });

//       await tx.user.update({
//         where: { id: userId },
//         data: { coins: { increment: plan.monthlyCoins } },
//       });
//     });
//   }

//   // 2️⃣ Subscription cancelled
//   if (event.type === "customer.subscription.deleted") {
//     const subscription = event.data.object as Stripe.Subscription;
//     await prisma.membership.updateMany({
//       where: { stripeSubscriptionId: subscription.id },
//       data: { status: "CANCELLED" },
//     });
//   }
// };
