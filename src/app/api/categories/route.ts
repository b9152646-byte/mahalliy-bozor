import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Kategoriyalarni olishda xatolik:", error);
    return NextResponse.json(
      { error: "Kategoriyalarni yuklab bo'lmadi" },
      { status: 500 }
    );
  }
}
