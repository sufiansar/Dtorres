import { z } from "zod";


export const createMembershipPlanSchema = z.object({
  body: z.object({
    name: z.enum(["BASIC", "PREMIUM", "VIP"] as const, {
      message: "Plan name is required",
    }),
    price: z.number({ message: "Price is required" }).min(0),
    monthlyCoins: z.number({ message: "Monthly coins required" }).min(0),
    duration: z.date({ message: "Duration required" }),
    description: z.string().optional(),
    stripePriceId: z.string().optional(),
    features: z.array(z.string()).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateMembershipPlanSchema = z.object({
  body: z.object({
    name: z.enum(["BASIC", "PREMIUM", "VIP"] as const).optional(),
    price: z.number().min(0).optional(),
    monthlyCoins: z.number().min(0).optional(),
    duration: z.number().min(1).optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    membershipId: z.string({ message: "Membership ID is required" }),
  }),
  query: z.object({}),
});


export const deleteMembershipPlanSchema = z.object({
  body: z.object({}),
  params: z.object({
    membershipId: z.string({ message: "Membership ID is required" }),
  }),
  query: z.object({}),
});


export const getMembershipPlansSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    active: z.string().optional(),
  }),
});