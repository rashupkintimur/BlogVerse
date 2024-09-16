import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded.userId !== "string") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Преобразование ID в ObjectId
    const userId = new ObjectId(decoded.userId);
    const user = await db.collection("users").findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const posts = await db
      .collection("posts")
      .find({
        user_id: userId,
      })
      .toArray();

    return NextResponse.json({
      posts,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
