import type {
  LoginResponse,
  User,
} from "../types/auth";

import API_URL from "../config/api";

const TOKEN_KEY =
  "it_support_token";

const USER_KEY =
  "it_support_user";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response =
    await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      data?.message ||
        "Login failed."
    );
  }

  return response.json();
}

export function saveSession(
  data: LoginResponse
) {
  localStorage.setItem(
    TOKEN_KEY,
    data.token
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(
      data.user
    )
  );
}

export function getToken():
  | string
  | null {
  return localStorage.getItem(
    TOKEN_KEY
  );
}

export function getStoredUser():
  | User
  | null {
  const storedUser =
    localStorage.getItem(
      USER_KEY
    );

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(
      storedUser
    ) as User;
  } catch {
    clearSession();

    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(
    TOKEN_KEY
  );

  localStorage.removeItem(
    USER_KEY
  );
}