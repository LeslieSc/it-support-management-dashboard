import type {
  LoginResponse,
  User,
} from "../types/auth";

const API_URL = "http://localhost:3000/api";

const TOKEN_KEY = "it_support_token";
const USER_KEY = "it_support_user";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.message ||
        "Unable to log in."
    );
  }

  return response.json();
}

export function saveSession(
  session: LoginResponse
) {
  localStorage.setItem(
    TOKEN_KEY,
    session.token
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(session.user)
  );
}

export function getToken() {
  return localStorage.getItem(
    TOKEN_KEY
  );
}

export function getStoredUser(): User | null {
  const data =
    localStorage.getItem(USER_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch {
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