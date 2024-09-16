import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Продолжайте обработку запроса
  return NextResponse.next();
}
