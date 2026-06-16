import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: { id: true, name: true, phone: true, createdAt: true },
        },
        subcategory: {
          include: { category: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "E'lon topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("E'lon olishda xatolik:", error);
    return NextResponse.json({ error: "E'lonni yuklab bo'lmadi" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.listing.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({
      success: true,
      message: "E'lon muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error("E'lon o'chirish xatoligi:", error);
    return NextResponse.json({ error: "E'lonni o'chirib bo'lmadi" }, { status: 500 });
  }
}
