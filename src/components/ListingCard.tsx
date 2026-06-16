import Link from "next/link";
import Image from "next/image";
import { formatPrice, parseImages } from "@/lib/utils";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    location: string;
    images: string;
    createdAt: Date | string;
    subcategory: {
      name: string;
      category: { name: string; icon: string };
    };
  };
  size?: "small" | "medium" | "large";
}

export default function ListingCard({ listing, size = "medium" }: ListingCardProps) {
  const images = parseImages(listing.images);
  const imageUrl = images[0] || "/uploads/placeholder.svg";
  const heightClass =
    size === "large" ? "h-72" : size === "small" ? "h-40" : "h-56";

  return (
    <Link href={`/elon/${listing.id}`} className="masonry-item group block">
      <article className="card overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5">
        <div className={`relative ${heightClass} w-full overflow-hidden bg-gray-100`}>
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
            {listing.subcategory.category.icon} {listing.subcategory.name}
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-brand-700">
            {listing.title}
          </h3>
          <p className="mt-2 text-lg font-bold text-brand-700">{formatPrice(listing.price)}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {listing.location}
          </p>
        </div>
      </article>
    </Link>
  );
}
