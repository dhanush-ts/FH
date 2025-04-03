import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("✅ Middleware is running on:", req.nextUrl.pathname);

  // Apply headers to prevent issues with OAuth popups
  const res = NextResponse.next();
  res.headers.set("Cross-Origin-Opener-Policy", "unsafe-none");
  res.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");

  return res;
}

// ✅ Only run middleware for pages & API routes, not static files
export const config = {
  matcher: ["/:path*"],
};
