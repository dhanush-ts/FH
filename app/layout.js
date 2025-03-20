"use client"
import { useState } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { AuthProvider, useAuth } from "./providers"; 

// export const metadata = {
//   title: "Find Hacks",
//   description: "Fink Hacks | your hackathon searching destination",
// };

export default function RootLayout({ children }) {

  
  return (
    <html lang="en">
      <body style={{fontFamily: 'Poppins'}} className={`font-poppins antialiased`}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
