import { Router } from "express";

import {
  createTicket,
  getTicketById,
  getTicketHistory,
  getTickets,
  updateTicket,
} from "../controllers/ticketController.js";

const router = Router();

router.get("/", getTickets);

router.get("/:id/history", getTicketHistory);

router.get("/:id", getTicketById);

router.post("/", createTicket);

router.patch("/:id", updateTicket);

export default router;