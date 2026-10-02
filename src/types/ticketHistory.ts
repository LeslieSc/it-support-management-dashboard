import type {
  User,
} from "./auth";

export interface TicketHistory {
  id: number;
  ticketId: number;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changedBy: User | null;
  changedAt: string;
}