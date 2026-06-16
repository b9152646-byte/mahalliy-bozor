import Link from "next/link";
import prisma from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const listings = query
    ? await prisma.listing.findMany({
        where: {
          isDeleted: false,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { location: { contains: query } },
          ],
        },
        include: {
          subcategory: {
            include: { category: { select: { name: true, icon: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Qidiruv natijalari
        {query && (
          <span className="ml-2 text-lg font-normal text-gray-500">
            &ldquo;{query}&rdquo; — {listings.length} ta natija
          </span>
        )}
      </h1>

      <form action="/qidiruv" method="GET" className="mt-6 max-w-xl">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="E'lonlarni qidiring..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary">
            Qidirish
          </button>
        </div>
      </form>

      {!query ? (
        <div className="card mt-8 p-12 text-center">
          <span className="text-5xl">🔎</span>
          <p className="mt-4 text-gray-600">Qidirish uchun kalit so&apos;z kiriting</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="card mt-8 p-12 text-center">
          <span className="text-5xl">😔</span>
          <p className="mt-4 text-lg font-medium text-gray-900">Hech narsa topilmadi</p>
          <p className="mt-2 text-sm text-gray-500">
            Boshqa kalit so&apos;z bilan qayta urinib ko&apos;ring
          </p>
        </div>
      ) : (
        <div className="masonry-grid mt-8">
          {listings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              size={index % 3 === 0 ? "large" : "medium"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
