// components/AuthGuard.tsx (Client Component)
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function AuthGuard({ children }) {
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

  return <>{children}</>;
}
