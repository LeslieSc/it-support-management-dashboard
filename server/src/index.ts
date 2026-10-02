import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
  pool,
} from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import {
  startTicketAutomation,
} from "./services/automationService.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";

dotenv.config();

const app =
  express();

const PORT =
  process.env.PORT || 3000;

app.use(
  cors()
);

app.use(
  express.json()
);

app.get(
  "/",
  (_req, res) => {
    res.json({
      message:
        "IT Support API is running",
    });
  }
);

app.get(
  "/api/health",
  async (_req, res) => {
    try {
      const result =
        await pool.query(
          "SELECT NOW()"
        );

      res.json({
        status: "ok",
        service:
          "IT Support Management API",
        database:
          "connected",
        databaseTime:
          result.rows[0].now,
      });
    } catch (error) {
      console.error(
        "Database connection error:",
        error
      );

      res.status(500).json({
        status: "error",
        service:
          "IT Support Management API",
        database:
          "disconnected",
      });
    }
  }
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

/*
 * These must always be placed
 * after all valid application routes.
 */
app.use(
  notFoundHandler
);

app.use(
  errorHandler
);

startTicketAutomation();

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  }
);