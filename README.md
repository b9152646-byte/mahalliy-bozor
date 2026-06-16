# Mahalliy Bozor

O'zbekiston uchun zamonaviy onlayn marketplace — OLX, Pinterest va Amazon uslubidagi to'liq funksional platforma.

## Imkoniyatlar

- **Autentifikatsiya**: Pochta, login yoki telefon orqali ro'yxatdan o'tish va kirish
- **Takroriy ro'yxatdan o'tishni bloklash**: Har bir email, login va telefon unikal
- **Parol saqlash**: Brauzer "Save password" funksiyasi uchun to'g'ri form atributlari
- **Pinterest uslubidagi grid**: Bosh sahifada turli o'lchamdagi e'lon kartochkalari
- **E'lon joylashtirish**: Rasm yuklash, sarlavha, narx, joylashuv, kategoriya, tavsif
- **Real-vaqt chat**: Socket.io orqali sotuvchi bilan xabar almashish
- **Telefon qilish**: E'lon sahifasida "Sotuvchiga telefon qilish" tugmasi
- **8 ta kategoriya**: To'liq ierarxik subkategoriyalar bilan
- **Admin panel** (`/admin`): Foydalanuvchilarni bloklash, e'lonlarni o'chirish

## O'rnatish

### 1. Node.js o'rnating

[https://nodejs.org](https://nodejs.org) dan Node.js 18+ versiyasini yuklab o'rnating.

### 2. Loyihani ishga tushiring

```bash
cd "Mahalli bozor"
npm install
npm run setup
npm run dev
```

Brauzerda oching: **http://localhost:3000**

## Demo akkauntlar

| Rol | Login | Parol |
|-----|-------|-------|
| Admin | `admin` | `admin123` |
| Foydalanuvchi | `azizkarimov` | `user1234` |

Admin panel: http://localhost:3000/admin

## Texnologiyalar

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma + SQLite**
- **Socket.io** (real-vaqt chat)
- **JWT** (sessiya boshqaruvi)
- **bcryptjs** (parol shifrlash)

## Loyiha strukturasi

```
src/
├── app/                  # Sahifalar va API route'lar
│   ├── admin/            # Admin panel
│   ├── elon/[id]/        # E'lon detali + chat
│   ├── elon-joylash/     # E'lon joylashtirish
│   ├── kategoriya/[slug]/ # Kategoriya sahifasi
│   ├── kirish/           # Login
│   ├── ro'yxatdan-otish/ # Register
│   └── api/              # Backend API
├── components/           # UI komponentlar
└── lib/                  # Auth, Prisma, utils
```

## Kategoriyalar

1. 📱 Elektronika (Maishiy texnika, Telefonlar, Televizorlar)
2. 🚗 Transport vositalari (Yengil, Yuk, Mototsikllar, TAXI)
3. 🏢 Ko'chmas mulk (Kvartira, Hovli, Yer, Ijara)
4. 👕 Kiyim-kechak (Erkaklar, Ayollar, Bolalar)
5. 🛋 Mebel va uy jihozlari
6. 💼 Ish o'rinlari (Doimiy, Kunlik)
7. 🛠 Xizmatlar
8. 🚜 Qishloq xo'jaligi
