import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const listings = await prisma.listing.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        subcategory: {
          include: { category: { select: { name: true, icon: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Admin e'lonlarini olishda xatolik:", error);
    return NextResponse.json({ error: "E'lonlarni yuklab bo'lmadi" }, { status: 500 });
  }
}
