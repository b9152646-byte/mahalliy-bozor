"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatDate, formatPrice, parseImages } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string | null;
  login: string | null;
  phone: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
  _count: { listings: number };
}

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string;
  isDeleted: boolean;
  createdAt: string;
  user: { id: string; name: string; email: string | null; phone: string | null };
  subcategory: {
    name: string;
    category: { name: string; icon: string };
  };
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "listings">("users");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, listingsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/listings"),
      ]);

      if (usersRes.status === 403 || listingsRes.status === 403) {
        window.location.href = "/kirish";
        return;
      }

      const usersData = await usersRes.json();
      const listingsData = await listingsRes.json();

      setUsers(usersData.users || []);
      setListings(listingsData.listings || []);
    } catch {
      setMessage("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    const action = isBanned ? "bloklash" : "blokdan chiqarish";
    if (!confirm(`Foydalanuvchini ${action}ni tasdiqlaysizmi?`)) return;

    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isBanned }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) loadData();
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("E'lonni o'chirishni tasdiqlaysizmi?")) return;

    const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) loadData();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Admin panel yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin panel</h1>
          <p className="mt-1 text-sm text-gray-600">
            Foydalanuvchilar va e&apos;lonlarni boshqaring
          </p>
        </div>
        <Link href="/" className="btn-secondary">
          Bosh sahifaga qaytish
        </Link>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-800 ring-1 ring-brand-200">
          {message}
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "users"
              ? "bg-brand-600 text-white"
              : "bg-white text-gray-700 ring-1 ring-gray-200"
          }`}
        >
          Foydalanuvchilar ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "listings"
              ? "bg-brand-600 text-white"
              : "bg-white text-gray-700 ring-1 ring-gray-200"
          }`}
        >
          E&apos;lonlar ({listings.length})
        </button>
      </div>

      {activeTab === "users" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Ism
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Pochta
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Login
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Telefon
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    E&apos;lonlar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Holat
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {user.name}
                      {user.isAdmin && (
                        <span className="ml-2 rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {user.email || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {user.login || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {user.phone || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {user._count.listings}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {user.isBanned ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          Bloklangan
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Faol
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {!user.isAdmin && (
                        <button
                          onClick={() => handleBanUser(user.id, !user.isBanned)}
                          className={user.isBanned ? "btn-primary text-xs" : "btn-danger text-xs"}
                        >
                          {user.isBanned ? "Blokdan chiqarish" : "Bloklash"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "listings" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Sarlavha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Narx
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Kategoriya
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Sotuvchi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Sana
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Holat
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="max-w-xs truncate px-4 py-3 text-sm font-medium text-gray-900">
                      <Link
                        href={`/elon/${listing.id}`}
                        className="hover:text-brand-600"
                      >
                        {listing.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {listing.subcategory.category.icon} {listing.subcategory.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {listing.user.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {listing.isDeleted ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          O&apos;chirilgan
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Faol
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {!listing.isDeleted && (
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="btn-danger text-xs"
                        >
                          O&apos;chirish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
