import { prisma } from "../../config/prisma";
import { stripe } from "../../config/stripe.config";
import { v4 as uuidv4 } from "uuid";
import { PAYMENT_STATUS, PaymentType } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";

export const createSubscriptionService = async (
  userId: string,
  planId: string,
) => {
  // 1️⃣ Find user
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // 2️⃣ Find plan
  const plan = await prisma.membershipPlan.findUnique({
    where: { id: planId },
  });
  if (!plan || !plan.stripePriceId) throw new Error("Plan invalid");

  // 3️⃣ Stripe customer create if not exists
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  // 4️⃣ Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      id: uuidv4(),
      userId,
      amount: plan.price,
      status: PAYMENT_STATUS.PENDING,
      type: PaymentType.SUBSCRIPTION,
      coins: plan.monthlyCoins,
    },
  });

  // 5️⃣ Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    metadata: {
      userId,
      transactionId: transaction.id,
      planId,
      type: "subscription",
    },
    success_url: `${process.env.CLIENT_URL}/dashboard`,
    cancel_url: `${process.env.CLIENT_URL}/pricing`,
  });

  return session.url;
};

export const cancelSubscriptionService = async (userId: string) => {
  const membership = await prisma.membership.findUnique({ where: { userId } });
  if (!membership?.stripeSubscriptionId)
    throw new Error("No active subscription");

  await stripe.subscriptions.cancel(membership.stripeSubscriptionId);

  await prisma.membership.update({
    where: { userId },
    data: { status: "CANCELED" },
  });

  return true;
};

export const getAllSubscription = async (user: any, query: any) => {
  if (!user?.id) throw new Error("User ID is required");

  if (user.role === "USER") {
    throw new AppError(403, "Access denied");
  }
  const subscriptions = await prisma.membership.findMany({
    include: { plan: true },
  });
  return subscriptions;
};
