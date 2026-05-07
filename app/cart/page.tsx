import { getMessages } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function CartPage() {
  const { common } = await getMessages();
  return (
    <div className="min-h-screen flex flex-col">
      <Header t={common} />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-light mb-8">{common.cart.checkout}</h1>
        <p className="text-gray-500">{common.cart.empty}</p>
      </main>
      <Footer rights={common.footer.rights} />
    </div>
  );
}
