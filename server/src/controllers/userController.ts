import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  pool,
} from "../config/database.js";

export async function getAssignableTechnicians(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result =
      await pool.query(`
        SELECT
          id,
          full_name AS "fullName",
          email,
          role
        FROM users
        WHERE role IN (
          'ADMIN',
          'TECHNICIAN'
        )
        ORDER BY
          full_name ASC
      `);

    return res.json(
      result.rows
    );
  } catch (error) {
    next(error);
  }
}