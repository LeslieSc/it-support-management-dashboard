import type {
  Request,
  Response,
} from "express";

import {
  pool,
} from "../config/database.js";

export async function getDashboardStats(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (
          WHERE status = 'Open'
        )::int AS "openTickets",

        COUNT(*) FILTER (
          WHERE status = 'In Progress'
        )::int AS "inProgressTickets",

        COUNT(*) FILTER (
          WHERE status = 'Resolved'
        )::int AS "resolvedTickets",

        COUNT(*) FILTER (
          WHERE priority = 'Critical'
        )::int AS "criticalTickets",

        COUNT(*) FILTER (
          WHERE is_overdue = TRUE
        )::int AS "overdueTickets",

        COUNT(*)::int AS "totalTickets"

      FROM tickets
    `);

    res.json(
      result.rows[0]
    );
  } catch (error) {
    console.error(
      "Error getting dashboard stats:",
      error
    );

    res.status(500).json({
      message:
        "Error getting dashboard statistics",
    });
  }
}