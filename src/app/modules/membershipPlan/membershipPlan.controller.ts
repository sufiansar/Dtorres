import { Request, Response } from "express";
import {
  createSubscriptionService,
  cancelSubscriptionService,
  getAllSubscriptionService,
} from "./membershipPlan.service";
import { catchAsync } from "../../utility/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.body;
  const userId = (req.user as JwtPayload).id;

  if (!planId) throw new AppError(httpStatus.BAD_REQUEST, "Plan is required");

  const url = await createSubscriptionService(userId, planId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscription created successfully",
    data: url,
  });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload).id;

  await cancelSubscriptionService(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscription cancelled successfully",
    data: null,
  });
});

const getAllSubscription = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const query = req.query;

  const subscription = await getAllSubscriptionService(user, query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All subscriptions retrieved successfully",
    data: subscription,
  });
});

export const MemberShipPlanController = {
  createSubscription,
  cancelSubscription,
  getAllSubscription,
};
