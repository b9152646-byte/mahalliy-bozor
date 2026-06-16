"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ChatBox from "@/components/ChatBox";
import { formatPrice, formatDate, parseImages } from "@/lib/utils";

interface ListingDetailProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    images: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      phone: string | null;
    };
    subcategory: {
      name: string;
      category: { name: string; icon: string; slug: string };
    };
  };
  session: {
    id: string;
    name: string;
  } | null;
}

export default function ListingDetailClient({ listing, session }: ListingDetailProps) {
  const images = parseImages(listing.images);
  const [activeImage, setActiveImage] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [showChat, setShowChat] = useState(false);

  const isOwner = session?.id === listing.user.id;

  const handleStartChat = async () => {
    if (!session) return;
    setChatLoading(true);
    setChatError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setChatError(data.error || "Chat ochib bo'lmadi");
        return;
      }

      setConversationId(data.conversation.id);
      setShowChat(true);
    } catch {
      setChatError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">
          Bosh sahifa
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/kategoriya/${listing.subcategory.category.slug}`}
          className="hover:text-brand-600"
        >
          {listing.subcategory.category.icon} {listing.subcategory.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image
                src={images[activeImage] || "/uploads/placeholder.svg"}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ${
                      activeImage === i ? "ring-brand-500" : "ring-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card mt-6 p-6">
            <h2 className="text-lg font-bold text-gray-900">Tavsif</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {listing.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card sticky top-24 p-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <span>{listing.subcategory.category.icon}</span>
              <span>
                {listing.subcategory.category.name} → {listing.subcategory.name}
              </span>
            </div>

            <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
            <p className="mt-3 text-3xl font-extrabold text-brand-700">
              {formatPrice(listing.price)}
            </p>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {listing.location}
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDate(listing.createdAt)}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-900">Sotuvchi</p>
              <p className="mt-1 text-sm text-gray-600">{listing.user.name}</p>
            </div>

            {!isOwner && (
              <div className="mt-6 space-y-3">
                {listing.user.phone && (
                  <a
                    href={`tel:${listing.user.phone}`}
                    className="btn-accent flex w-full items-center justify-center gap-2"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Sotuvchiga telefon qilish
                  </a>
                )}

                {session ? (
                  <>
                    {!showChat && (
                      <button
                        onClick={handleStartChat}
                        disabled={chatLoading}
                        className="btn-primary w-full"
                      >
                        {chatLoading ? "Chat ochilmoqda..." : "Sotuvchi bilan chat"}
                      </button>
                    )}
                    {chatError && (
                      <p className="text-sm text-red-600">{chatError}</p>
                    )}
                  </>
                ) : (
                  <Link href="/kirish" className="btn-primary block w-full text-center">
                    Chat uchun tizimga kiring
                  </Link>
                )}
              </div>
            )}

            {isOwner && (
              <p className="mt-6 rounded-lg bg-brand-50 p-3 text-sm text-brand-700">
                Bu sizning e&apos;loningiz
              </p>
            )}
          </div>

          {showChat && conversationId && session && !isOwner && (
            <div className="mt-6">
              <ChatBox
                conversationId={conversationId}
                currentUserId={session.id}
                receiverId={listing.user.id}
                receiverName={listing.user.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
