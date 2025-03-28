"use client"
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { AuthProvider, useAuth } from "./providers"; 
import { GoogleOAuthProvider } from '@react-oauth/google';


export default function RootLayout({ children }) {
  const CLIENT_ID = "803976634382-ffm3v2818gk5kqoj5q39i5944dtmna39.apps.googleusercontent.com";
  return (
    <html lang="en">
      <body style={{fontFamily: 'Poppins'}} className={`font-poppins antialiased`}>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <AuthProvider suppressHydrationWarning>
            <Header />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}