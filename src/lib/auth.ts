import { JWTPayload, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload as JWTPayload;
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}
