// // middleware.ts
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// export function middleware(req) {
//   const res = NextResponse.next();

//   res.headers.set("Cross-Origin-Opener-Policy", "unsafe-none");
//   res.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");

//   const protectedPaths = ["/profile", "/host", "/dashboard"]; // add more if needed
//   const { pathname, search } = req.nextUrl;

//   const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

//   const accessToken = req.cookies.get("access_token")?.value;
//   const isLoggedIn = !!accessToken;

//   if (isProtected && !isLoggedIn) {
//     const loginUrl = new URL("/login", req.url);
//     const callbackUrl = pathname + search;
//     loginUrl.searchParams.set("callbackUrl", callbackUrl);
//     return NextResponse.redirect(loginUrl);
//   }

//   return res;
// }

// // ✅ Apply middleware to all routes (including API), skip static files
// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };


import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export function middleware(req) {
  const { nextUrl, headers, cookies } = req
  const { pathname, search } = nextUrl
  const host = headers.get("host") || ""
  const accessToken = cookies.get("access_token")?.value
  const isLoggedIn = !!accessToken

  const isLocal = host.endsWith("lvh.me:3000")
  const isProd = host.endsWith("iamdts.xyz")
  const parts = host.split(".")
  const subdomain = parts.length > 2 ? parts[0] : null
  
  // 🧭 Subdomain Rewrite
  if ((isLocal || isProd) && subdomain && subdomain !== "www") {
    const rewrittenUrl = nextUrl.clone()
    rewrittenUrl.pathname = `/subdomain/${subdomain}${pathname}`
    const response = NextResponse.rewrite(rewrittenUrl)
  console.log("REWRITE TO: ", rewrittenUrl.pathname)
    response.headers.set("Cross-Origin-Opener-Policy", "unsafe-none")
    response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none")
    return response
  }

  // 🔐 Auth Protection
  const protectedPaths = ["/profile", "/host", "/dashboard"]
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  // ✅ Default response (no subdomain match)
  const response = NextResponse.next()
  response.headers.set("Cross-Origin-Opener-Policy", "unsafe-none")
  response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none")
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
