import prisma from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";

export default async function HomePage() {
  const [listings, categories] = await Promise.all([
    prisma.listing.findMany({
      where: { isDeleted: false },
      include: {
        subcategory: {
          include: { category: { select: { name: true, icon: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: { subcategories: true, _count: { select: { subcategories: true } } },
    }),
  ]);

  const sizes: Array<"small" | "medium" | "large"> = ["large", "medium", "small", "medium", "large", "small"];

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Mahalliy Bozor — sizning onlayn bozoringiz
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              E&apos;lon joylashtiring, qidiring va soting. Elektronikadan tortib ko&apos;chmas
              mulkgacha — hamma narsa bir joyda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/elon-joylash" className="btn-accent">
                + E&apos;lon joylashtirish
              </Link>
              <Link href="/kategoriya/elektronika" className="btn-secondary !text-gray-800">
                Kategoriyalarni ko&apos;rish
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Kategoriyalar</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategoriya/${cat.slug}`}
              className="card flex flex-col items-center p-4 text-center transition hover:shadow-md hover:ring-2 hover:ring-brand-200"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="mt-2 text-xs font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            So&apos;nggi e&apos;lonlar
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({listings.length} ta)
            </span>
          </h2>
        </div>

        {listings.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="text-5xl">📭</span>
            <p className="mt-4 text-lg font-medium text-gray-900">Hali e&apos;lonlar yo&apos;q</p>
            <p className="mt-2 text-sm text-gray-500">
              Birinchi bo&apos;lib e&apos;lon joylashtiring!
            </p>
            <Link href="/elon-joylash" className="btn-primary mt-6 inline-flex">
              E&apos;lon joylashtirish
            </Link>
          </div>
        ) : (
          <div className="masonry-grid">
            {listings.map((listing, index) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                size={sizes[index % sizes.length]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
