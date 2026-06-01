import type { Metadata } from "next";
import Script from "next/script";
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

  const GA_IDS: Record<string, string> = {
    ro: 'G-CDPCQJPWMZ', // ro.cookware-market.com
    ru: 'G-E47PEJ9WWJ', // eu.cookware-market.com (Russian-language DE market)
    no: 'G-79JXT06M5D', // no.cookware-market.com
    de: 'G-HPGE803F3E', // de.cookware-market.com
    at: 'G-RJT6EP4FDP', // at.cookware-market.com
  };
  const gaId = GA_IDS[LOCALE];

  return (
    <html lang={lang} dir={dir}>
      <body>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { send_page_view: false });
            `}</Script>
          </>
        )}
        <CartProvider>
          {children}
          <CartPanel t={common.cart} />
        </CartProvider>
      </body>
    </html>
  );
}
