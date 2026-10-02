import express from "express";
import cors from "cors";

import {
  pool,
} from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";

const app = express();

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
  async (_req, res, next) => {
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
      next(error);
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

app.use(
  notFoundHandler
);

app.use(
  errorHandler
);

export default app;