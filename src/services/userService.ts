import type {
  User,
} from "../types/auth";

import {
  apiFetch,
} from "./api";

import API_URL from "../config/api";

export async function getTechnicians(): Promise<
  User[]
> {
  const response =
    await apiFetch(
      `${API_URL}/users/technicians`
    );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch technicians"
    );
  }

  return response.json();
}