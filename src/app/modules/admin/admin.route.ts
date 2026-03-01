// src/routes/admin.routes.ts
import { Router } from "express";
import * as AdminController from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import auth from "../../middlewares/checkAuth"
import { UserRole } from "@prisma/client";
import {
  createMembershipPlanSchema,
  updateMembershipPlanSchema,
  deleteMembershipPlanSchema,
  getMembershipPlansSchema,
} from "./admin.validation";


const router = Router();


router.use(auth( UserRole.SUPER_ADMIN, UserRole.ADMIN));

// Users
router.get("/users", AdminController.getUsers);

// Membership Plans
router.get(
  "/membership-plans",
  validateRequest(getMembershipPlansSchema),
  AdminController.getMembershipPlans
);

router.post(
  "/membership-plans",
  validateRequest(createMembershipPlanSchema),
  AdminController.createMembershipPlan
);

router.patch(
  "/membership-plans/:membershipId",
  validateRequest(updateMembershipPlanSchema),
  AdminController.updateMembershipPlan
);

router.delete(
  "/membership-plans/:membershipId",
  validateRequest(deleteMembershipPlanSchema),
  AdminController.deleteMembershipPlan
);

// Characters
// router.get("/charcters", AdminController.getMembershipPlan);
// router.post("/charcters", AdminController.getMembershipPlan);
// router.patch("/charcters/:characterId", AdminController.getMembershipPlan);
// router.delete("/charcters/:characterId", AdminController.getMembershipPlan);


export const AdminRoute = router;