import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import * as AdminService  from "./admin.service";
import AppError from "../../errorHelpers/AppError";


export const getUsers = catchAsync(async (req: Request, res: Response) => {
        
    const result = await AdminService.getUsers();

    return  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully retrieve all user",
    data: result,
  });
})

export const getMembershipPlans = catchAsync(async (req: Request, res: Response) => {
  const plans = await AdminService.getMembershipPlans();
  res.status(200).json({
    statusCode: httpStatus.OK,
    message: "Successfully retrieve all MembershipPlan",
    success: true,
    data: plans,
  });
})

export const createMembershipPlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await AdminService.createMembershipPlan(req.body);
  res.status(201).json({
    statusCode: httpStatus.CREATED,
    message: "Membership plan created successfully",
    success: true,
    data: plan,
  });
})

export const updateMembershipPlan = catchAsync(async (req: Request, res: Response) => {
  const membershipId = req.params.membershipId as string;
  const plan = await AdminService.updateMembershipPlan(membershipId, req.body);

  res.status(200).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Membership plan updated successfully",
    data: plan,
  });
})

export const deleteMembershipPlan = catchAsync(async (req: Request, res: Response) => {
  const membershipId = req.params.membershipId as string;
  const plan = await AdminService.deleteMembershipPlan(membershipId);

  res.status(200).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Membership plan deactivated",
    data: plan,
  });
})