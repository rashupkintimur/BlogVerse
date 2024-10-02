import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: postId } = params;

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

    const { text } = await request.json();

    // создаем комментарий к посту
    await db.collection("comments").insertOne({
      userId: new ObjectId(userId),
      postId: new ObjectId(postId),
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
      .find({ postId: new ObjectId(id) })
      .toArray();

    // Извлекаем все user_id из комментариев
    const userIds = comments.map((comment) => new ObjectId(comment.userId));

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
