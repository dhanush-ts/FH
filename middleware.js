import { NextResponse } from "next/server";

export function middleware(req) {
  const res = NextResponse.next();
  res.headers.set("Cross-Origin-Opener-Policy", "unsafe-none");
  res.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");

  return res;
}

// ✅ Only run middleware for pages & API routes, not static files
export const config = {
  matcher: ["/:path*"],
};
