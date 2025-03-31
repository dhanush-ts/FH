"use client";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "../providers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";

export default function RootLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      setCheckingAuth(false); // Stop loading once authentication is checked
    }
  }, [isAuthenticated, router]);

  if (checkingAuth) return <Loading />; // Show loading state while checking

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
