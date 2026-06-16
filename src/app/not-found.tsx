import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl">404</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Sahifa topilmadi</h1>
      <p className="mt-2 text-gray-600">
        Siz qidirayotgan sahifa mavjud emas yoki o&apos;chirilgan
      </p>
      <Link href="/" className="btn-primary mt-8">
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
