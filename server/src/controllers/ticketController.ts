import type { Request, Response } from "express";

import { pool } from "../config/database.js";

export async function getTickets(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        branch,
        category,
        priority,
        status,
        assigned_to AS "assignedTo",
        is_overdue AS "isOverdue",
        created_at AS "createdAt"
      FROM tickets
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting tickets:", error);

    res.status(500).json({
      message: "Error getting tickets",
    });
  }
}

export async function getTicketById(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        branch,
        category,
        priority,
        status,
        assigned_to AS "assignedTo",
        is_overdue AS "isOverdue",
        created_at AS "createdAt"
      FROM tickets
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting ticket:", error);

    res.status(500).json({
      message: "Error getting ticket",
    });
  }
}

export async function createTicket(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      description,
      branch,
      category,
      priority,
    } = req.body;

    if (
      !title ||
      !description ||
      !branch ||
      !category ||
      !priority
    ) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO tickets (
        title,
        description,
        branch,
        category,
        priority
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        title,
        description,
        branch,
        category,
        priority,
        status,
        assigned_to AS "assignedTo",
        is_overdue AS "isOverdue",
        created_at AS "createdAt"
      `,
      [
        title,
        description,
        branch,
        category,
        priority,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating ticket:", error);

    res.status(500).json({
      message: "Error creating ticket",
    });
  }
}

export async function updateTicket(
  req: Request,
  res: Response
) {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      status,
      assignedTo,
    } = req.body;

    const validStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Closed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid ticket status.",
      });
    }

    const technician =
      assignedTo && assignedTo.trim() !== ""
        ? assignedTo.trim()
        : null;

    await client.query("BEGIN");

    const currentResult = await client.query(
      `
      SELECT
        status,
        assigned_to AS "assignedTo"
      FROM tickets
      WHERE id = $1
      FOR UPDATE
      `,
      [id]
    );

    if (currentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const currentTicket =
      currentResult.rows[0];

    const result = await client.query(
      `
      UPDATE tickets
      SET
        status = $1,
        assigned_to = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING
        id,
        title,
        description,
        branch,
        category,
        priority,
        status,
        assigned_to AS "assignedTo",
        is_overdue AS "isOverdue",
        created_at AS "createdAt"
      `,
      [
        status,
        technician,
        id,
      ]
    );

    if (currentTicket.status !== status) {
      await client.query(
        `
        INSERT INTO ticket_history (
          ticket_id,
          field_name,
          old_value,
          new_value
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          id,
          "status",
          currentTicket.status,
          status,
        ]
      );
    }

    if (
      currentTicket.assignedTo !== technician
    ) {
      await client.query(
        `
        INSERT INTO ticket_history (
          ticket_id,
          field_name,
          old_value,
          new_value
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          id,
          "assignedTo",
          currentTicket.assignedTo,
          technician,
        ]
      );
    }

    await client.query("COMMIT");

    res.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Error updating ticket:",
      error
    );

    res.status(500).json({
      message: "Error updating ticket",
    });
  } finally {
    client.release();
  }
}

export async function getTicketHistory(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        ticket_id AS "ticketId",
        field_name AS "fieldName",
        old_value AS "oldValue",
        new_value AS "newValue",
        changed_at AS "changedAt"
      FROM ticket_history
      WHERE ticket_id = $1
      ORDER BY changed_at DESC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(
      "Error getting ticket history:",
      error
    );

    res.status(500).json({
      message: "Error getting ticket history",
    });
  }
}