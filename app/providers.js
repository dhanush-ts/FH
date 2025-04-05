"use client";
import { fetchWithAuth } from "@/app/api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetchWithAuth("/user/basic-profile/");
        const data = await response.json();

        setIsAuthenticated(data?.id ? true : false);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; 

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
