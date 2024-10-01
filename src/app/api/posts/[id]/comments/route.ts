import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: postId } = params;

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

    const { text } = await request.json();

    await db.collection("comments").insertOne({
      user_id: new ObjectId(userId),
      post_id: new ObjectId(postId),
      text,
    });

    return NextResponse.json(
      {
        message: "Comment posted successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Получаем комментарии поста
    const comments = await db
      .collection("comments")
      .find({ post_id: new ObjectId(id) })
      .toArray();

    // Извлекаем все user_id из комментариев
    const userIds = comments.map((comment) => new ObjectId(comment.user_id));

    // Получаем имена пользователей по их user_id
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .project({ name: 1 }) // Получаем только поле 'name'
      .toArray();

    return NextResponse.json({
      comments,
      users,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
