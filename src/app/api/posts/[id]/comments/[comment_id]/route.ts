import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { comment_id: string } }
) {
  const { comment_id } = params;

  try {
    await db
      .collection("comments")
      .deleteOne({ _id: new ObjectId(comment_id) });

    return NextResponse.json(
      {
        message: "Comment deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
