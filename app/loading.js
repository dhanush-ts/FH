"use client";
import { useEffect, useState } from "react";
import "ldrs/infinity";

export default function Loading() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    import("ldrs/infinity"); // Ensure it's loaded dynamically
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {hydrated && (
        <l-infinity
          size="121"
          stroke="10"
          stroke-length="0.51"
          bg-opacity="0.1"
          speed="1.3"
          color="rgb(0, 143, 10)"
        ></l-infinity>
      )}

    </div>
  );
}
