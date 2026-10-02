import {
  Router,
} from "express";

import {
  getAssignableTechnicians,
} from "../controllers/userController.js";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = Router();

router.use(
  authenticateToken
);

router.get(
  "/technicians",
  authorizeRoles(
    "ADMIN",
    "TECHNICIAN"
  ),
  getAssignableTechnicians
);

export default router;