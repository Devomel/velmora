import type { Metadata } from "next";
import { LOCALE, LOCALE_META } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tableware Store",
  description: "Premium tableware for every occasion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, dir } = LOCALE_META[LOCALE];
  return (
    <html lang={lang} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
