// middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req) {
  const res = NextResponse.next();

  // 🛡 Set headers for cross-origin policies
  res.headers.set("Cross-Origin-Opener-Policy", "unsafe-none");
  res.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");

  const protectedPaths = ["/profile", "/host", "/dashboard"]; // add more if needed
  const { pathname, search } = req.nextUrl;

  // ✅ Check if the current path requires auth
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  const accessToken = req.cookies.get("access_token")?.value;
  const isLoggedIn = !!accessToken;

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    const callbackUrl = pathname + search;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// ✅ Apply middleware to all routes (including API), skip static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};