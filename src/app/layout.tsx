import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mahalliy Bozor — O'zbekistonning onlayn bozori",
  description:
    "Mahalliy Bozor — e'lonlar joylashtiring, sotib oling va soting. OLX, Pinterest va Amazon uslubidagi zamonaviy marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
