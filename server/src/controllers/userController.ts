import type {
  Request,
  Response,
} from "express";

import {
  pool,
} from "../config/database.js";

export async function getAssignableTechnicians(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
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
      ORDER BY full_name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(
      "Error getting technicians:",
      error
    );

    res.status(500).json({
      message:
        "Error getting technicians",
    });
  }
}