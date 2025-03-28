"use client"
import { Toaster } from "@/components/ui/sonner"
import { useAuth } from "../providers";
import { notFound } from "next/navigation";

export default function RootLayout({ children }) {
  const { isAuthenticated } = useAuth();
  if(!isAuthenticated){
    notFound();
  }

  return (
      <div>
        {children}
        <Toaster />
      </div>
  );
}