import cron from "node-cron";

import { pool } from "../config/database.js";

async function updateOverdueTickets() {
  try {
    const result = await pool.query(`
      UPDATE tickets
      SET
        is_overdue = CASE
          WHEN
            status IN ('Open', 'In Progress')
            AND created_at < NOW() - INTERVAL '24 hours'
          THEN TRUE
          ELSE FALSE
        END
      WHERE
        is_overdue IS DISTINCT FROM (
          CASE
            WHEN
              status IN ('Open', 'In Progress')
              AND created_at < NOW() - INTERVAL '24 hours'
            THEN TRUE
            ELSE FALSE
          END
        )
      RETURNING id
    `);

    if (result.rowCount && result.rowCount > 0) {
      console.log(
        `Automation updated ${result.rowCount} ticket(s).`
      );
    }
  } catch (error) {
    console.error(
      "Ticket automation error:",
      error
    );
  }
}

export function startTicketAutomation() {
  console.log("Ticket automation service started.");

  updateOverdueTickets();

  cron.schedule("* * * * *", async () => {
    await updateOverdueTickets();
  });
}