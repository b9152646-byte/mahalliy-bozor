import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  checkDuplicateUser,
  createToken,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, login, phone, password } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Ism kiritish majburiy" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    if (!email?.trim() && !login?.trim() && !phone?.trim()) {
      return NextResponse.json(
        {
          error:
            "Kamida bittasi majburiy: pochta, login yoki telefon raqam",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email?.trim().toLowerCase() || null;
    const normalizedLogin = login?.trim().toLowerCase() || null;
    const normalizedPhone = phone?.trim() || null;

    const duplicateError = await checkDuplicateUser({
      email: normalizedEmail || undefined,
      login: normalizedLogin || undefined,
      phone: normalizedPhone || undefined,
    });

    if (duplicateError) {
      return NextResponse.json({ error: duplicateError }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        login: normalizedLogin,
        phone: normalizedPhone,
        password: hashedPassword,
      },
    });

    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      login: user.login,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        login: user.login,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Ro'yxatdan o'tish xatoligi:", error);
    return NextResponse.json(
      { error: "Ro'yxatdan o'tishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
