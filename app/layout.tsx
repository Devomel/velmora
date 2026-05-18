import type { Metadata } from "next";
import { getMessages, LOCALE, LOCALE_META } from "@/lib/i18n";
import { CartProvider } from "@/components/CartProvider";
import CartPanel from "@/components/CartPanel";
import "./globals.css";

export const metadata: Metadata = {
  title: "cookware market — Premium tableware",
  description: "Premium porcelain, ceramic and glass tableware. Free delivery from 50 €. Over 500 satisfied customers.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { common } = await getMessages();
  const { lang, dir } = LOCALE_META[LOCALE];

  return (
    <html lang={lang} dir={dir}>
      <body>
        <CartProvider>
          {children}
          <CartPanel t={common.cart} />
        </CartProvider>
      </body>
    </html>
  );
}
