import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createToken, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier?.trim() || !password) {
      return NextResponse.json(
        { error: "Login va parol kiritish majburiy" },
        { status: 400 }
      );
    }

    const normalized = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalized },
          { login: normalized },
          { phone: identifier.trim() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Foydalanuvchi topilmadi. Ma'lumotlaringizni tekshiring" },
        { status: 401 }
      );
    }

    if (user.isBanned) {
      return NextResponse.json(
        { error: "Sizning akkauntingiz bloklangan. Admin bilan bog'laning" },
        { status: 403 }
      );
    }

    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Noto'g'ri parol. Qayta urinib ko'ring" },
        { status: 401 }
      );
    }

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
      message: "Tizimga muvaffaqiyatli kirdingiz",
      user: {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Kirish xatoligi:", error);
    return NextResponse.json(
      { error: "Kirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
