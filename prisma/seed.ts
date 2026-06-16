import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Elektronika",
    slug: "elektronika",
    icon: "📱",
    subcategories: [
      { name: "Maishiy texnika", slug: "maishiy-texnika" },
      { name: "Telefonlar", slug: "telefonlar" },
      { name: "Televizorlar", slug: "televizorlar" },
    ],
  },
  {
    name: "Transport vositalari",
    slug: "transport-vositalari",
    icon: "🚗",
    subcategories: [
      { name: "Yengil avtomobillar", slug: "yengil-avtomobillar" },
      { name: "Yuk avtomobillari", slug: "yuk-avtomobillari" },
      { name: "Mototsikllar", slug: "mototsikllar" },
      { name: "TAXI", slug: "taxi" },
    ],
  },
  {
    name: "Ko'chmas mulk",
    slug: "kochmas-mulk",
    icon: "🏢",
    subcategories: [
      { name: "Ko'p qavatli uylar", slug: "kop-qavatli-uylar" },
      { name: "Hovli", slug: "hovli" },
      { name: "Yer uchastkalari", slug: "yer-uchastkalari" },
      { name: "Ijaraga beriladigan uylar", slug: "ijaraga-beriladigan-uylar" },
    ],
  },
  {
    name: "Kiyim-kechak",
    slug: "kiyim-kechak",
    icon: "👕",
    subcategories: [
      { name: "Erkaklar kiyimlari", slug: "erkaklar-kiyimlari" },
      { name: "Ayollar kiyimlari", slug: "ayollar-kiyimlari" },
      { name: "Bolalar kiyimlari", slug: "bolalar-kiyimlari" },
    ],
  },
  {
    name: "Mebel va uy jihozlari",
    slug: "mebel-va-uy-jihozlari",
    icon: "🛋",
    subcategories: [
      { name: "Mebellar", slug: "mebellar" },
      { name: "Uy jihozlari", slug: "uy-jihozlari" },
    ],
  },
  {
    name: "Ish o'rinlari",
    slug: "ish-orinlari",
    icon: "💼",
    subcategories: [
      { name: "Doimiy ish", slug: "doimiy-ish" },
      { name: "Kunlik ishlar", slug: "kunlik-ishlar" },
    ],
  },
  {
    name: "Xizmatlar",
    slug: "xizmatlar",
    icon: "🛠",
    subcategories: [{ name: "Xizmatlar", slug: "xizmatlar-bolim" }],
  },
  {
    name: "Qishloq xo'jaligi",
    slug: "qishloq-xojaligi",
    icon: "🚜",
    subcategories: [
      { name: "Qishloq xo'jaligi mahsulotlari", slug: "qishloq-xojaligi-mahsulotlari" },
    ],
  },
];

async function main() {
  console.log("Ma'lumotlar bazasi to'ldirilmoqda...");

  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user1234", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin@mahalliybozor.uz",
      login: "admin",
      phone: "+998901234567",
      password: adminPassword,
      isAdmin: true,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Aziz Karimov",
      email: "aziz@example.com",
      login: "azizkarimov",
      phone: "+998909876543",
      password: userPassword,
    },
  });

  const demoUser2 = await prisma.user.create({
    data: {
      name: "Malika Yusupova",
      email: "malika@example.com",
      login: "malikay",
      phone: "+998911223344",
      password: userPassword,
    },
  });

  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        subcategories: {
          create: cat.subcategories.map((sub) => ({
            name: sub.name,
            slug: sub.slug,
          })),
        },
      },
      include: { subcategories: true },
    });

    if (cat.slug === "elektronika") {
      await prisma.listing.create({
        data: {
          title: "iPhone 15 Pro Max 256GB",
          description:
            "Yangi holatda, quti va aksessuarlar bilan. Kafolat mavjud. Rang: Titan qora.",
          price: 12500000,
          location: "Toshkent, Chilonzor",
          images: JSON.stringify(["/uploads/demo-phone.svg"]),
          userId: demoUser.id,
          subcategoryId: category.subcategories.find((s) => s.slug === "telefonlar")!.id,
        },
      });
      await prisma.listing.create({
        data: {
          title: "Samsung 55\" Smart Televizor",
          description:
            "4K UHD, Smart TV funksiyasi. 1 yil foydalanilgan, ideal holatda.",
          price: 4800000,
          location: "Toshkent, Yunusobod",
          images: JSON.stringify(["/uploads/demo-tv.svg"]),
          userId: demoUser2.id,
          subcategoryId: category.subcategories.find((s) => s.slug === "televizorlar")!.id,
        },
      });
    }

    if (cat.slug === "transport-vositalari") {
      await prisma.listing.create({
        data: {
          title: "Chevrolet Cobalt 2022",
          description:
            "Yoqilg'i: Gaz+benzin. Probег: 45000 km. Birinchi egasi. To'liq komplektatsiya.",
          price: 95000000,
          location: "Samarqand",
          images: JSON.stringify(["/uploads/demo-car.svg"]),
          userId: demoUser.id,
          subcategoryId: category.subcategories.find(
            (s) => s.slug === "yengil-avtomobillar"
          )!.id,
        },
      });
    }

    if (cat.slug === "kochmas-mulk") {
      await prisma.listing.create({
        data: {
          title: "3 xonali kvartira sotiladi",
          description:
            "Yangi qurilgan binoda, 85 kv.m, 5/9 qavat. Remont qilingan, mebel bilan.",
          price: 720000000,
          location: "Toshkent, Mirzo Ulug'bek",
          images: JSON.stringify(["/uploads/demo-apartment.svg"]),
          userId: demoUser2.id,
          subcategoryId: category.subcategories.find(
            (s) => s.slug === "kop-qavatli-uylar"
          )!.id,
        },
      });
    }

    if (cat.slug === "mebel-va-uy-jihozlari") {
      await prisma.listing.create({
        data: {
          title: "Zamonaviy divan to'plami",
          description: "3+2+1 o'lchamda, yumshoq mebel. Rang: kulrang. Yetkazib berish bepul.",
          price: 8500000,
          location: "Andijon",
          images: JSON.stringify(["/uploads/demo-sofa.svg"]),
          userId: demoUser.id,
          subcategoryId: category.subcategories.find((s) => s.slug === "mebellar")!.id,
        },
      });
    }

    if (cat.slug === "ish-orinlari") {
      await prisma.listing.create({
        data: {
          title: "Sotuv menejeri kerak",
          description:
            "Doimiy ish. Maosh: kelishilgan. Tajriba talab qilinmaydi. O'qitish beriladi.",
          price: 5000000,
          location: "Toshkent, Shayxontohur",
          images: JSON.stringify(["/uploads/demo-job.svg"]),
          userId: demoUser2.id,
          subcategoryId: category.subcategories.find((s) => s.slug === "doimiy-ish")!.id,
        },
      });
    }
  }

  console.log("Seed muvaffaqiyatli yakunlandi!");
  console.log("Admin: login=admin, parol=admin123");
  console.log("Demo foydalanuvchi: login=azizkarimov, parol=user1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
