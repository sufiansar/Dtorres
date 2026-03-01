import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import dbConfig from "../../config/db.config";
import * as AdminService  from "./admin.service";
import { JwtPayload } from "jsonwebtoken";
import HttpStatus from "http-status";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utility/setCookie";
import { createUserToken } from "../../utility/userToken";

export const getUsers = catchAsync(async (req: Request, res: Response) => {
        
    const result = await AdminService.getUsers();

    return  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully retrieve all user",
    data: result,
  });
})