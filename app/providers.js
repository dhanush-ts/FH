// "use client";
// import { fetchWithAuth } from "@/lib/api";
// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     async function checkAuth() {
//       try {
//         const response = await fetchWithAuth("/user/basic-profile/"); // ✅ Parse JSON
//         const data = await response.json();

//         if (data?.id) {
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false);
//         }

//         console.log("User Data:", data);
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setIsAuthenticated(false);
//       }
//     }

//     checkAuth(); // ✅ Call the async function
//   }, []);

//   console.log("Authenticated:", isAuthenticated);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

"use client";
import { fetchWithAuth } from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // ⚡ Avoid initial mismatch

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetchWithAuth("/user/basic-profile/");
        const data = await response.json();

        setIsAuthenticated(data?.id ? true : false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  // 🔥 FIX: Avoid rendering until `isAuthenticated` is set
  if (isAuthenticated === null) return null; 

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
