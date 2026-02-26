// import bodyParser from "body-parser";
// import { handleSubscriptionWebhook } from "./modules/membershipPlan/membershipPlan.webhook.service";

// app.post(
//   "/webhook/subscription",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const signature = req.headers["stripe-signature"] as string;
//     await handleSubscriptionWebhook(signature, req.body);
//     res.json({ received: true });
//   },
// );
