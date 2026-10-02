import {
  Router,
} from "express";

import {
  createTicket,
  getTicketById,
  getTicketHistory,
  getTickets,
  updateTicket,
} from "../controllers/ticketController.js";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

import {
  validateBody,
} from "../middleware/validateRequest.js";

import {
  createTicketSchema,
  updateTicketSchema,
} from "../schemas/ticketSchemas.js";

const router =
  Router();

router.use(
  authenticateToken
);

router.get(
  "/",
  getTickets
);

router.get(
  "/:id/history",
  getTicketHistory
);

router.get(
  "/:id",
  getTicketById
);

router.post(
  "/",
  validateBody(
    createTicketSchema
  ),
  createTicket
);

router.patch(
  "/:id",
  authorizeRoles(
    "ADMIN",
    "TECHNICIAN"
  ),
  validateBody(
    updateTicketSchema
  ),
  updateTicket
);

export default router;