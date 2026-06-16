"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    login: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Parollar mos kelmayapti");
      return;
    }

    if (!form.email && !form.login && !form.phone) {
      setError("Kamida bittasi majburiy: pochta, login yoki telefon raqam");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || null,
          login: form.login || null,
          phone: form.phone || null,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ro'yxatdan o'tishda xatolik yuz berdi");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-12">
      <div className="card w-full p-8">
        <div className="mb-8 text-center">
          <span className="text-4xl">📝</span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Ro&apos;yxatdan o&apos;tish</h1>
          <p className="mt-2 text-sm text-gray-600">
            Mahalliy Bozor&apos;da e&apos;lon joylashtirish va xarid qilish uchun ro&apos;yxatdan o&apos;ting
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} method="post" autoComplete="on">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                To&apos;liq ism <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Ismingiz va familiyangiz"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Pochta manzili
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="example@mail.uz"
              />
            </div>

            <div>
              <label htmlFor="login" className="mb-1.5 block text-sm font-medium text-gray-700">
                Login
              </label>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                value={form.login}
                onChange={handleChange}
                className="input-field"
                placeholder="foydalanuvchi_nomi"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                Telefon raqam
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+998901234567"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Parol <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Kamida 6 ta belgi"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                Parolni tasdiqlash <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Parolni qayta kiriting"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Ro&apos;yxatdan o&apos;tish..." : "Ro&apos;yxatdan o&apos;tish"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Allaqachon akkauntingiz bormi?{" "}
          <Link href="/kirish" className="font-semibold text-brand-600 hover:text-brand-700">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}
