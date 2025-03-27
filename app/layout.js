"use client"
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { AuthProvider, useAuth } from "./providers"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{fontFamily: 'Poppins'}} className={`font-poppins antialiased`}>
        <AuthProvider suppressHydrationWarning>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}