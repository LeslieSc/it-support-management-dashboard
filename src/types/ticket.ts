import type {
  User,
} from "./auth";

export type TicketPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed";

export type TicketCategory =
  | "Network"
  | "Hardware"
  | "Software"
  | "POS"
  | "Access"
  | "Other";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  branch: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;

  createdBy: User | null;
  assignedTo: User | null;

  isOverdue: boolean;
  createdAt: string;
}