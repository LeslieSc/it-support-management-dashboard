import {
  z,
} from "zod";

export const ticketCategorySchema =
  z.enum([
    "Network",
    "Hardware",
    "Software",
    "POS",
    "Access",
    "Other",
  ]);

export const ticketPrioritySchema =
  z.enum([
    "Low",
    "Medium",
    "High",
    "Critical",
  ]);

export const ticketStatusSchema =
  z.enum([
    "Open",
    "In Progress",
    "Resolved",
    "Closed",
  ]);

export const createTicketSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        3,
        "Title must contain at least 3 characters."
      )
      .max(
        150,
        "Title cannot exceed 150 characters."
      ),

    description: z
      .string()
      .trim()
      .min(
        5,
        "Description must contain at least 5 characters."
      )
      .max(
        2000,
        "Description cannot exceed 2000 characters."
      ),

    branch: z
      .string()
      .trim()
      .min(
        2,
        "Branch must contain at least 2 characters."
      )
      .max(
        100,
        "Branch cannot exceed 100 characters."
      ),

    category:
      ticketCategorySchema,

    priority:
      ticketPrioritySchema,
  });

export const updateTicketSchema =
  z.object({
    status:
      ticketStatusSchema,

    assignedToUserId: z
      .number()
      .int(
        "Technician ID must be an integer."
      )
      .positive(
        "Technician ID must be positive."
      )
      .nullable(),
  });