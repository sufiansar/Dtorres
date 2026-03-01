import { Router } from "express";
import * as AdminController from "./admin.controller";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();
router.get("/users", auth(), AdminController.getUsers);


export const AdminRoute = router;
