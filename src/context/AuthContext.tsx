import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/constants/types";
import { generateId } from "@/utils/formatters";

const INITIAL_USERS_MOCK: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@teste.com",
    password: "123456",
  },
];

interface AuthContextData {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => {
    success: boolean;
    error?: string;
  };
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS_MOCK);

  function login(email: string, password: string): boolean {
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      return true;
    }

    return false;
  }

  function register(
    name: string,
    email: string,
    password: string
  ): { success: boolean; error?: string } {
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, error: "Este e-mail já está cadastrado." };
    }

    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);

    return { success: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
