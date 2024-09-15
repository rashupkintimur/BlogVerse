import { NextResponse } from "next/server";
import { db } from "../../../lib/mongodb";

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
