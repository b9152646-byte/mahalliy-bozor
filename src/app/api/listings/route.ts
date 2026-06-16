import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const subcategorySlug = searchParams.get("subcategory");
    const search = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: Record<string, unknown> = { isDeleted: false };

    if (subcategorySlug) {
      where.subcategory = { slug: subcategorySlug };
    } else if (categorySlug) {
      where.subcategory = { category: { slug: categorySlug } };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, phone: true } },
        subcategory: {
          include: { category: { select: { name: true, icon: true, slug: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("E'lonlarni olishda xatolik:", error);
    return NextResponse.json({ error: "E'lonlarni yuklab bo'lmadi" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "E'lon joylashtirish uchun tizimga kiring" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const location = formData.get("location") as string;
    const subcategoryId = formData.get("subcategoryId") as string;
    const imageFiles = formData.getAll("images") as File[];

    if (!title?.trim() || !description?.trim() || !location?.trim() || !subcategoryId) {
      return NextResponse.json(
        { error: "Barcha majburiy maydonlarni to'ldiring" },
        { status: 400 }
      );
    }

    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "To'g'ri narx kiriting" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const imagePaths: string[] = [];

    for (const file of imageFiles) {
      if (file.size === 0) continue;
      if (!file.type.startsWith("image/")) continue;

      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${uuidv4()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      imagePaths.push(`/uploads/${filename}`);
    }

    if (imagePaths.length === 0) {
      return NextResponse.json(
        { error: "Kamida bitta rasm yuklang" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price,
        location: location.trim(),
        images: JSON.stringify(imagePaths),
        userId: session.id,
        subcategoryId,
      },
      include: {
        subcategory: { include: { category: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "E'lon muvaffaqiyatli joylashtirildi",
      listing,
    });
  } catch (error) {
    console.error("E'lon joylashtirish xatoligi:", error);
    return NextResponse.json(
      { error: "E'lon joylashtirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
