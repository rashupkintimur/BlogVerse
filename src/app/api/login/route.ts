import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "@/lib/mongodb";
import { serialize } from "cookie";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Найти пользователя по email
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Проверить пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Генерация JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" } // Токен истекает через 1 час
    );

    // Сериализуем cookie с помощью метода serialize
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
      sameSite: "strict",
      path: "/",
    });

    // Создаём ответ
    const response = NextResponse.json({ success: true });

    // Добавляем заголовок Set-Cookie в ответ
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: "Authorization failed" },
      { status: 500 }
    );
  }
}
