export interface TicketHistory {
  id: number;
  ticketId: number;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changedAt: string;
}