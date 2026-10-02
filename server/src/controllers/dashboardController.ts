import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  pool,
} from "../config/database.js";

export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    let result;

    if (
      req.user.role ===
      "EMPLOYEE"
    ) {
      result = await pool.query(
        `
        SELECT
          COUNT(*) FILTER (
            WHERE status = 'Open'
          )::int
            AS "openTickets",

          COUNT(*) FILTER (
            WHERE status =
              'In Progress'
          )::int
            AS "inProgressTickets",

          COUNT(*) FILTER (
            WHERE status =
              'Resolved'
          )::int
            AS "resolvedTickets",

          COUNT(*) FILTER (
            WHERE priority =
              'Critical'
          )::int
            AS "criticalTickets",

          COUNT(*) FILTER (
            WHERE is_overdue =
              TRUE
          )::int
            AS "overdueTickets",

          COUNT(*)::int
            AS "totalTickets"

        FROM tickets

        WHERE
          created_by_user_id = $1
        `,
        [
          req.user.userId,
        ]
      );
    } else {
      result =
        await pool.query(`
          SELECT
            COUNT(*) FILTER (
              WHERE status = 'Open'
            )::int
              AS "openTickets",

            COUNT(*) FILTER (
              WHERE status =
                'In Progress'
            )::int
              AS "inProgressTickets",

            COUNT(*) FILTER (
              WHERE status =
                'Resolved'
            )::int
              AS "resolvedTickets",

            COUNT(*) FILTER (
              WHERE priority =
                'Critical'
            )::int
              AS "criticalTickets",

            COUNT(*) FILTER (
              WHERE is_overdue =
                TRUE
            )::int
              AS "overdueTickets",

            COUNT(*)::int
              AS "totalTickets"

          FROM tickets
        `);
    }

    return res.json(
      result.rows[0]
    );
  } catch (error) {
    next(error);
  }
}