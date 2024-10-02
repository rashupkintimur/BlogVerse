import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { db } from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  try {
    const { name, email } = await request.json();

    // получаем userId из cookie
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    // получаем текущего пользоватля
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // обновляем данные пользователя
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          name,
          email,
        },
      }
    );

    return NextResponse.json({
      name,
      email,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
