import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ error: "Suhbat ID kerak" }, { status: 400 });
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Kirish talab qilinadi" }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Suhbat topilmadi" }, { status: 404 });
    }

    if (conversation.buyerId !== session.id && conversation.sellerId !== session.id) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Xabarlarni olishda xatolik:", error);
    return NextResponse.json({ error: "Xabarlarni yuklab bo'lmadi" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Kirish talab qilinadi" }, { status: 401 });
    }

    const body = await request.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ error: "E'lon ID kerak" }, { status: 400 });
    }

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, isDeleted: false },
      include: { user: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "E'lon topilmadi" }, { status: 404 });
    }

    if (listing.userId === session.id) {
      return NextResponse.json(
        { error: "O'z e'loningiz bilan chat ochib bo'lmaydi" },
        { status: 400 }
      );
    }

    let conversation = await prisma.conversation.findUnique({
      where: {
        listingId_buyerId: {
          listingId,
          buyerId: session.id,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listingId,
          buyerId: session.id,
          sellerId: listing.userId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      conversation,
      seller: {
        id: listing.user.id,
        name: listing.user.name,
        phone: listing.user.phone,
      },
    });
  } catch (error) {
    console.error("Suhbat ochishda xatolik:", error);
    return NextResponse.json({ error: "Suhbat ochib bo'lmadi" }, { status: 500 });
  }
}
