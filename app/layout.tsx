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
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18199942441" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18199942441');${gaId ? `gtag('config','${gaId}',{send_page_view:false});` : ''}` }} />
      </head>
      <body>
        <Script id="clarity" strategy="afterInteractive">{`
          (function(){
            var ids={ro:'x4dgqs8yru',eu:'x4dht7vqti',no:'x4dh3hhh1h',de:'x4df9wpo1m',at:'x4dhctqi0e'};
            var id=ids[location.hostname.slice(0,2)];
            if(!id)return;
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script",id);
          })();
        `}</Script>
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','2780185745681318');
          fbq('track','PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2780185745681318&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <CartProvider>
          {children}
          <CartPanel t={common.cart} />
        </CartProvider>
      </body>
    </html>
  );
}
