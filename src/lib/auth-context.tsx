"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, MOCK_USERS } from "./mock-data";

import { loginUser, registerUser } from "@/app/actions";

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, role: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password?: string) => {
    // Try mock first
    let foundUser = MOCK_USERS.find(u => u.email === email);
    
    // Try database
    if (!foundUser) {
      const dbUser = await loginUser(email, password || "hashed_pw");
      if (dbUser) foundUser = dbUser;
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("mock_user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, role: string, password?: string) => {
    try {
      const newUser = await registerUser(name, email, role, password || "hashed_pw");
      setUser(newUser);
      localStorage.setItem("mock_user", JSON.stringify(newUser));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
