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
      setCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  if (checkingAuth) return <Loading />;

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
