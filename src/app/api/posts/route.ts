import { NextResponse } from "next/server";
import { db } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await db.collection("posts").find({}).toArray();

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

export async function POST(request: Request) {
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

    const { title, description } = await request.json();

    const currentData = new Date();

    // создаём новый пост
    db.collection("posts").insertOne({
      user_id: user._id,
      title,
      description,
      createdAt: currentData,
    });

    return NextResponse.json({
      _id: user._id,
      title,
      description,
      createdAt: currentData,
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
