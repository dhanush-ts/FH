"use client";
import { fetchWithAuth } from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  useEffect(() => {
    const response = fetchWithAuth("/user/basic-profile/");
    if (response.status === 200) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  },[]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}