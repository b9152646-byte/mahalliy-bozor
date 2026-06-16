"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: Subcategory[];
}

export default function CreateListingForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setError("Kategoriyalarni yuklab bo'lmadi"));
  }, []);

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("subcategoryId", subcategoryId);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "E'lon joylashtirishda xatolik");
        return;
      }

      router.push(`/elon/${data.listing.id}`);
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Yangi e&apos;lon joylashtirish</h1>
        <p className="mt-2 text-sm text-gray-600">
          Mahsulotingiz yoki xizmatingiz haqida batafsil ma&apos;lumot bering
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Rasmlar <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={(e) => setImages(e.target.files)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
          />
          <p className="mt-1 text-xs text-gray-500">Bir nechta rasm yuklashingiz mumkin (JPG, PNG)</p>
        </div>

        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
            Sarlavha <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Masalan: iPhone 15 Pro Max 256GB"
            maxLength={200}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-gray-700">
              Narx (so&apos;m) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
              placeholder="1000000"
            />
          </div>
          <div>
            <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-gray-700">
              Joylashuv <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
              placeholder="Toshkent, Chilonzor"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
              Kategoriya <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              required
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSubcategoryId("");
              }}
              className="input-field"
            >
              <option value="">Kategoriyani tanlang</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategory" className="mb-1.5 block text-sm font-medium text-gray-700">
              Kichik kategoriya <span className="text-red-500">*</span>
            </label>
            <select
              id="subcategory"
              required
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="input-field"
              disabled={!selectedCat}
            >
              <option value="">Kichik kategoriyani tanlang</option>
              {selectedCat?.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
            Batafsil ma&apos;lumot <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field resize-none"
            placeholder="Mahsulot yoki xizmat haqida batafsil yozing..."
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Joylashtirilmoqda..." : "E'lonni joylashtirish"}
        </button>
      </form>
    </div>
  );
}
