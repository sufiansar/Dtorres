import { MembershipPlanName } from "@prisma/client";

export interface GetUsers {
    transactionID: string,
    name: string,
    email: string,
    plan: MembershipPlanName | "",
    coinBalance: number, // user.coins
    coinUsed: number,  
    joinDate: Date
}

export interface CreatePlanPayload {
  name: MembershipPlanName;
  description?: string;
  price: number;
  monthlyCoins: number;
  duration: Date;
  stripePriceId?: string;
  features: string[];
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> {
  isActive?: boolean;
}