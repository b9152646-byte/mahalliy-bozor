import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { slug } = await params;
  const { sub } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { subcategories: true },
  });

  if (!category) notFound();

  const listings = await prisma.listing.findMany({
    where: {
      isDeleted: false,
      subcategory: sub
        ? { slug: sub, categoryId: category.id }
        : { categoryId: category.id },
    },
    include: {
      subcategory: {
        include: { category: { select: { name: true, icon: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const sizes: Array<"small" | "medium" | "large"> = ["medium", "large", "small", "medium"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <nav className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-600">
            Bosh sahifa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">
            {category.icon} {category.name}
          </span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">
          {category.icon} {category.name}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {listings.length} ta e&apos;lon topildi
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href={`/kategoriya/${slug}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !sub
              ? "bg-brand-600 text-white"
              : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-brand-50"
          }`}
        >
          Barchasi
        </Link>
        {category.subcategories.map((subcat) => (
          <Link
            key={subcat.id}
            href={`/kategoriya/${slug}?sub=${subcat.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              sub === subcat.slug
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-brand-50"
            }`}
          >
            {subcat.name}
          </Link>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-lg font-medium text-gray-900">
            Bu kategoriyada e&apos;lonlar topilmadi
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
    </div>
  );
}
