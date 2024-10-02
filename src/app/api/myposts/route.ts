import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { db } from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // получаем userId из cookie
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    // получаем текущего пользователя
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // получаем посты текущего пользователя
    const posts = await db
      .collection("posts")
      .find({
        userId: new ObjectId(userId),
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
