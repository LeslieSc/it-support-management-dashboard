import dotenv from "dotenv";

import app from "./app.js";

import {
  startTicketAutomation,
} from "./services/automationService.js";

dotenv.config();

const PORT =
  process.env.PORT || 3000;

startTicketAutomation();

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  }
);