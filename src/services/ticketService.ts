import type {
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../types/ticket";

const API_URL = "http://localhost:3000/api";

export interface CreateTicketData {
  title: string;
  description: string;
  branch: string;
  category: TicketCategory;
  priority: TicketPriority;
}

export interface UpdateTicketData {
  status: TicketStatus;
  assignedTo: string | null;
}

export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_URL}/tickets`);

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}

export async function getTicketById(
  id: number
): Promise<Ticket> {
  const response = await fetch(
    `${API_URL}/tickets/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch ticket");
  }

  return response.json();
}

export async function createTicket(
  ticket: CreateTicketData
): Promise<Ticket> {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(ticket),
  });

  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }

  return response.json();
}

export async function updateTicket(
  id: number,
  data: UpdateTicketData
): Promise<Ticket> {
  const response = await fetch(
    `${API_URL}/tickets/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update ticket");
  }

  return response.json();
}