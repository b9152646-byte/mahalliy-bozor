"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kirishda xatolik yuz berdi");
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
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="card w-full p-8">
        <div className="mb-8 text-center">
          <span className="text-4xl">🔐</span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Tizimga kirish</h1>
          <p className="mt-2 text-sm text-gray-600">
            Pochta, login yoki telefon raqamingiz va parolingizni kiriting
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
              <label htmlFor="identifier" className="mb-1.5 block text-sm font-medium text-gray-700">
                Pochta, login yoki telefon
              </label>
              <input
                id="identifier"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input-field"
                placeholder="admin yoki +998901234567"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Parol
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Parolingizni kiriting"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Kirish..." : "Kirish"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Akkauntingiz yo&apos;qmi?{" "}
          <Link href="/royxatdan-otish" className="font-semibold text-brand-600 hover:text-brand-700">
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </p>
      </div>
    </div>
  );
}
