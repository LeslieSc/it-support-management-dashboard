import {
  apiFetch,
} from "./api";

export interface DashboardStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  overdueTickets: number;
  totalTickets: number;
}

const API_URL =
  "http://localhost:3000/api";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response =
    await apiFetch(
      `${API_URL}/dashboard/stats`
    );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch dashboard statistics"
    );
  }

  return response.json();
}