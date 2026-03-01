import bcrypt from "bcryptjs";
import Jwt, { JwtPayload } from "jsonwebtoken";
import dbConfig from "../../config/db.config";
import { createUserToken } from "../../utility/userToken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { prisma } from "../../config/prisma";
import { forgetPasswordTemplate } from "../../utility/templates/forgetPasswordTemplate";
import { sendEmail } from "../../utility/sendEmail";
import { GetUsers } from "./admin.interface";


export const getUsers = async (): Promise<GetUsers[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      coins: true,
      createdAt: true,

      membership: {
        select: {
          plan: {
            select: {
              name: true,
            },
          },
        },
      },

      coinTransactions: {
        where: {
          type: "CREDIT",
        },
        select: {
          amount: true,
        },
      },

      transactions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
        },
      },
    },
  });

  return users.map((user) => {
    const totalCoins = user.coinTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    const coinUsed = user.coins;
    const coinBalance = totalCoins - coinUsed;

    return {
      transactionID: user.transactions[0]?.id || "",
      name: user.name,
      email: user.email,
      plan: user.membership?.plan.name ?? "CORE",
      coinBalance,
      coinUsed,
      joinDate: user.createdAt,
    };
  });
};
