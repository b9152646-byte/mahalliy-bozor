import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        
        {/* ORQAGA TUGMASI VA LOGOTIP BITTA KONTEYNERDA */}
        <div className="flex items-center gap-4 shrink-0">
          <a 
            href="javascript:history.back()" 
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition select-none"
          >
            ⬅ Orqaga
          </a>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <div>
              <span className="text-lg font-bold text-brand-700 sm:text-xl">
                Mahalliy Bozor
              </span>
              <p className="hidden text-xs text-gray-500 sm:block">
                O&apos;zbekiston onlayn bozori
              </p>
            </div>
          </Link>
        </div>

        {/* QIDIRUV FORMASI */}
        <form action="/qidiruv" method="GET" className="hidden flex-1 max-w-xl md:block">
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder="E'lonlarni qidiring..."
              className="input-field pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-brand-500"
            />
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>

        {/* REKLAMA QO'SHISH VA PROFIL */}
        <div className="flex items-center gap-4">
          <Link
            href="/elon-berish"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition"
          >
            + E'lon berish
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/profil" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                Kabinet
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/kirish" className="text-sm font-medium text-gray-700 hover:text-brand-600">
              Kirish
            </Link>
          )}
        </div>

      </div>

      {/* GORIZONTAL KATEGORIYALAR MENYUSI (Hamma 8 ta kategoriya) */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1 whitespace-nowrap scrollbar-hide">
          <Link href="/" className="shrink-0 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-medium text-white">
            Barchasi
          </Link>
          <Link href="/kategoriya/elektronika" className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
            📱 Elektronika
          </Link>
          <Link href="/kategoriya/transport-vositalari" className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
            🚗 Transport
          </Link>
          <Link href="/kategoriya/kochmas-mulk" className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
            🏢 Ko'chmas mulk
          </Link>
          <Link href="/kategoriya/kiyim-kechak" className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
            👕 Kiyim-kechak
          </Link>
          <Link href="/kategoriya/mebel" className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
            🛋️ Mebel
          </Link>
          <Link href="/kategoriya/ish-orinlari" className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
            💼 Ish o'rinlari
          </Link>
          <Link href="/kategoriya/xizmatlar" className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
            🛠️ Xizmatlar
          </Link>
          <Link href="/kategoriya/qishloq-xojaligi" className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
            🚜 Qishloq xo'jaligi
          </Link>
        </div>
      </div>
    </header>
  );
}