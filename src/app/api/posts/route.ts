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

    // получаем все посты, кроме постов текущего пользователя
    const posts = await db
      .collection("posts")
      .find({
        userId: { $ne: new ObjectId(userId) },
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

export async function POST(request: Request) {
  try {
    // получаем userId из cookie
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    // если userId нет, значит и токен тоже отсутствует
    if (!userId) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // получаем текущего пользователя
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { title, description, text } = await request.json();

    const currentData = new Date();

    // создаём новый пост
    const newPost = await db.collection("posts").insertOne({
      userId: user._id,
      title,
      description,
      text,
      createdAt: currentData,
    });

    return NextResponse.json({
      _id: newPost.insertedId,
      title,
      description,
      text,
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
