import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        login: true,
        phone: true,
        isAdmin: true,
        isBanned: true,
        createdAt: true,
        _count: { select: { listings: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Foydalanuvchilarni olishda xatolik:", error);
    return NextResponse.json(
      { error: "Foydalanuvchilarni yuklab bo'lmadi" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, isBanned } = body;

    if (!userId || typeof isBanned !== "boolean") {
      return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
    }

    if (userId === session.id) {
      return NextResponse.json(
        { error: "O'zingizni bloklay olmaysiz" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBanned },
    });

    return NextResponse.json({
      success: true,
      message: isBanned
        ? "Foydalanuvchi muvaffaqiyatli bloklandi"
        : "Foydalanuvchi blokdan chiqarildi",
      user,
    });
  } catch (error) {
    console.error("Foydalanuvchini bloklashda xatolik:", error);
    return NextResponse.json(
      { error: "Amalni bajarib bo'lmadi" },
      { status: 500 }
    );
  }
}
