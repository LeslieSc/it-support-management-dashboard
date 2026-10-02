import type {
  Request,
  Response,
} from "express";

import {
  pool,
} from "../config/database.js";

const ticketSelect = `
  SELECT
    t.id,
    t.title,
    t.description,
    t.branch,
    t.category,
    t.priority,
    t.status,

    CASE
      WHEN creator.id IS NULL THEN NULL
      ELSE json_build_object(
        'id', creator.id,
        'fullName', creator.full_name,
        'email', creator.email,
        'role', creator.role
      )
    END AS "createdBy",

    CASE
      WHEN technician.id IS NULL THEN NULL
      ELSE json_build_object(
        'id', technician.id,
        'fullName', technician.full_name,
        'email', technician.email,
        'role', technician.role
      )
    END AS "assignedTo",

    t.is_overdue AS "isOverdue",
    t.created_at AS "createdAt"

  FROM tickets t

  LEFT JOIN users creator
    ON creator.id =
      t.created_by_user_id

  LEFT JOIN users technician
    ON technician.id =
      t.assigned_to_user_id
`;

export async function getTickets(
  req: Request,
  res: Response
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
        ${ticketSelect}

        WHERE
          t.created_by_user_id = $1

        ORDER BY
          t.created_at DESC
        `,
        [
          req.user.userId,
        ]
      );
    } else {
      result = await pool.query(`
        ${ticketSelect}

        ORDER BY
          t.created_at DESC
      `);
    }

    res.json(
      result.rows
    );
  } catch (error) {
    console.error(
      "Error getting tickets:",
      error
    );

    res.status(500).json({
      message:
        "Error getting tickets",
    });
  }
}

export async function getTicketById(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const { id } =
      req.params;

    let result;

    if (
      req.user.role ===
      "EMPLOYEE"
    ) {
      result = await pool.query(
        `
        ${ticketSelect}

        WHERE
          t.id = $1
          AND
          t.created_by_user_id = $2
        `,
        [
          id,
          req.user.userId,
        ]
      );
    } else {
      result = await pool.query(
        `
        ${ticketSelect}

        WHERE
          t.id = $1
        `,
        [id]
      );
    }

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Ticket not found",
      });
    }

    res.json(
      result.rows[0]
    );
  } catch (error) {
    console.error(
      "Error getting ticket:",
      error
    );

    res.status(500).json({
      message:
        "Error getting ticket",
    });
  }
}

export async function createTicket(
  req: Request,
  res: Response
) {
  const client =
    await pool.connect();

  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

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
        message:
          "All required fields must be provided.",
      });
    }

    await client.query(
      "BEGIN"
    );

    const insertResult =
      await client.query(
        `
        INSERT INTO tickets (
          title,
          description,
          branch,
          category,
          priority,
          created_by_user_id
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )
        RETURNING id
        `,
        [
          title,
          description,
          branch,
          category,
          priority,
          req.user.userId,
        ]
      );

    const ticketId =
      insertResult.rows[0].id;

    const result =
      await client.query(
        `
        ${ticketSelect}

        WHERE
          t.id = $1
        `,
        [ticketId]
      );

    await client.query(
      "COMMIT"
    );

    res.status(201).json(
      result.rows[0]
    );
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    console.error(
      "Error creating ticket:",
      error
    );

    res.status(500).json({
      message:
        "Error creating ticket",
    });
  } finally {
    client.release();
  }
}

export async function updateTicket(
  req: Request,
  res: Response
) {
  const client =
    await pool.connect();

  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const { id } =
      req.params;

    const {
      status,
      assignedToUserId,
    } = req.body;

    const validStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Closed",
    ];

    if (
      !validStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid ticket status.",
      });
    }

    let newTechnicianName:
      | string
      | null = null;

    if (
      assignedToUserId !== null &&
      assignedToUserId !== undefined
    ) {
      const technicianResult =
        await client.query(
          `
          SELECT
            id,
            full_name AS "fullName",
            role
          FROM users
          WHERE id = $1
          `,
          [
            assignedToUserId,
          ]
        );

      if (
        technicianResult.rows
          .length === 0
      ) {
        return res.status(400).json({
          message:
            "Selected technician does not exist.",
        });
      }

      const technician =
        technicianResult.rows[0];

      if (
        technician.role !==
          "TECHNICIAN" &&
        technician.role !==
          "ADMIN"
      ) {
        return res.status(400).json({
          message:
            "Selected user cannot be assigned as a technician.",
        });
      }

      newTechnicianName =
        technician.fullName;
    }

    await client.query(
      "BEGIN"
    );

    const currentResult =
      await client.query(
        `
        SELECT
          t.status,

          t.assigned_to_user_id
            AS "assignedToUserId",

          assigned_user.full_name
            AS "assignedToName"

        FROM tickets t

        LEFT JOIN users assigned_user
          ON assigned_user.id =
            t.assigned_to_user_id

        WHERE t.id = $1

        FOR UPDATE OF t
        `,
        [id]
      );

    if (
      currentResult.rows.length ===
      0
    ) {
      await client.query(
        "ROLLBACK"
      );

      return res.status(404).json({
        message:
          "Ticket not found",
      });
    }

    const currentTicket =
      currentResult.rows[0];

    await client.query(
      `
      UPDATE tickets
      SET
        status = $1,
        assigned_to_user_id = $2,
        updated_at =
          CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      [
        status,
        assignedToUserId ??
          null,
        id,
      ]
    );

    if (
      currentTicket.status !==
      status
    ) {
      await client.query(
        `
        INSERT INTO ticket_history (
          ticket_id,
          field_name,
          old_value,
          new_value
        )
        VALUES (
          $1,
          $2,
          $3,
          $4
        )
        `,
        [
          id,
          "status",
          currentTicket.status,
          status,
        ]
      );
    }

    const previousTechnicianId =
      currentTicket.assignedToUserId ??
      null;

    const nextTechnicianId =
      assignedToUserId ??
      null;

    if (
      previousTechnicianId !==
      nextTechnicianId
    ) {
      await client.query(
        `
        INSERT INTO ticket_history (
          ticket_id,
          field_name,
          old_value,
          new_value
        )
        VALUES (
          $1,
          $2,
          $3,
          $4
        )
        `,
        [
          id,
          "assignedTo",
          currentTicket
            .assignedToName,
          newTechnicianName,
        ]
      );
    }

    const result =
      await client.query(
        `
        ${ticketSelect}

        WHERE
          t.id = $1
        `,
        [id]
      );

    await client.query(
      "COMMIT"
    );

    res.json(
      result.rows[0]
    );
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    console.error(
      "Error updating ticket:",
      error
    );

    res.status(500).json({
      message:
        "Error updating ticket",
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
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const { id } =
      req.params;

    if (
      req.user.role ===
      "EMPLOYEE"
    ) {
      const permissionResult =
        await pool.query(
          `
          SELECT id
          FROM tickets
          WHERE
            id = $1
            AND
            created_by_user_id = $2
          `,
          [
            id,
            req.user.userId,
          ]
        );

      if (
        permissionResult.rows
          .length === 0
      ) {
        return res.status(404).json({
          message:
            "Ticket not found",
        });
      }
    }

    const result =
      await pool.query(
        `
        SELECT
          id,
          ticket_id
            AS "ticketId",
          field_name
            AS "fieldName",
          old_value
            AS "oldValue",
          new_value
            AS "newValue",
          changed_at
            AS "changedAt"

        FROM ticket_history

        WHERE
          ticket_id = $1

        ORDER BY
          changed_at DESC
        `,
        [id]
      );

    res.json(
      result.rows
    );
  } catch (error) {
    console.error(
      "Error getting ticket history:",
      error
    );

    res.status(500).json({
      message:
        "Error getting ticket history",
    });
  }
}