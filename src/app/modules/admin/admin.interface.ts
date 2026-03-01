import { MembershipPlanName } from "@prisma/client";

export interface GetUsers {
    transactionID: string,
    name: string,
    email: string,
    plan: MembershipPlanName,
    coinBalance: number, // user.coins
    coinUsed: number,  
    joinDate: Date
}

// coin used = user.coins
// Total coin =  total user.coinTransaction.package.coins
// coin balance = Toatl coin - coin used