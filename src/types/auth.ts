export type UserRole =
  | "ADMIN"
  | "TECHNICIAN"
  | "EMPLOYEE";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  token: string;
}