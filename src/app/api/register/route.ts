import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Проверка уникальности email
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Получение этого самого пользователя
    const user = await db.collection("users").findOne({ email });

    if (user) {
      // Генерация JWT
      const token = jwt.sign(
        { userId: user._id, email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" } // Токен истекает через 1 час
      );

      return NextResponse.json({ token });
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
