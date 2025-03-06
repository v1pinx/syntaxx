import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export function middleware(req: NextRequest) {
  const protectedRoutes = [ "/profile"]; 

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const token = req.cookies.get("token")?.value; 

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, SECRET_KEY); 
    } catch {
      return NextResponse.redirect(new URL("/login", req.url)); 
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/profile/:path*"], 
};
