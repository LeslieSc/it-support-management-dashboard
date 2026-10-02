import {
  clearSession,
  getToken,
} from "./authService";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const headers = new Headers(
    options.headers
  );

  headers.set(
    "Content-Type",
    "application/json"
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    url,
    {
      ...options,
      headers,
    }
  );

  if (response.status === 401) {
    clearSession();

    window.location.href =
      "/login";
  }

  return response;
}