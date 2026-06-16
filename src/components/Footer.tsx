export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Mahalliy Bozor</h3>
            <p className="mt-2 text-sm text-gray-600">
              O&apos;zbekistonning eng qulay onlayn bozori. E&apos;lon joylashtiring,
              sotib oling va soting.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Bo&apos;limlar</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>Elektronika</li>
              <li>Transport vositalari</li>
              <li>Ko&apos;chmas mulk</li>
              <li>Ish o&apos;rinlari</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Yordam</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>Qanday e&apos;lon joylashtirish kerak?</li>
              <li>Xavfsizlik qoidalari</li>
              <li>Tez-tez so&apos;raladigan savollar</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Aloqa</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>Email: info@mahalliybozor.uz</li>
              <li>Telefon: +998 71 123 45 67</li>
              <li>Toshkent, O&apos;zbekiston</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Mahalliy Bozor. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
