import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/posts", request.url));
  }

  const publicPaths = [
    "/login",
    "/register",
    "/_next/",
    "/api/login",
    "/api/register",
  ];

  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // получаем token из cookie
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = await verifyToken(token);
  if (decoded) {
    // Передаем userId через заголовки ответа
    const response = NextResponse.next();
    response.cookies.set("userId", decoded.userId as string);
    return response;
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
