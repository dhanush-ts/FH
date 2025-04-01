"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setGlobalRouter } from "@/lib/routerService";

export default function GlobalRouterProvider() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // Mark as hydrated to prevent mismatch issues
  }, []);

  useEffect(() => {
    if (hydrated && router) {
      setGlobalRouter(router);
    }
  }, [hydrated, router]);

  return null; // No UI, just setting the global router
}
