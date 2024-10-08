import { ObjectId } from "mongodb";
import { db } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Удалить пост по id
    await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
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
    // Найти пост по id
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    if (post) {
      return NextResponse.json(post, { status: 200 });
    } else {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
