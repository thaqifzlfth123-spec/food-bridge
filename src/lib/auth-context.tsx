"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, MOCK_USERS } from "./mock-data";

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("mock_user", JSON.stringify(foundUser));
    } else {
      // Create a mock user for the demo
      const newUser: User = {
        id: `u_${Date.now()}`,
        name: email.split("@")[0],
        email: email,
        role: email.includes("cafe") ? "donor" : "receiver",
      };
      setUser(newUser);
      localStorage.setItem("mock_user", JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
