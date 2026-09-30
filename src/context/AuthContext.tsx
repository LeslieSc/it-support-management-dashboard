import {
  createContext,
  useContext,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  LoginResponse,
  User,
} from "../types/auth";

import {
  clearSession,
  getStoredUser,
  saveSession,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setSession: (
    data: LoginResponse
  ) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(
      getStoredUser()
    );

  const setSession = (
    data: LoginResponse
  ) => {
    saveSession(data);
    setUser(data.user);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated:
          user !== null,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}