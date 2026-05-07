import Link from "next/link";

type CommonT = {
  nav: { home: string; about: string; cart: string };
};

export default function Header({ t }: { t: CommonT }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Tableware
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/">{t.nav.home}</Link>
          <Link href="/about">{t.nav.about}</Link>
          <Link href="/cart">{t.nav.cart}</Link>
        </nav>
      </div>
    </header>
  );
}
