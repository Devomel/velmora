import { getMessages } from "@/lib/i18n";
import { PRODUCT_DATA } from '@/lib/products';
import { getProductImages } from '@/lib/product-images';
import HeroSection, { HeroAdvantages } from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import CatalogSection from './sections/CatalogSection';
import ReviewsSection from './sections/ReviewsSection';
import GuaranteesSection from './sections/GuaranteesSection';
import FaqSection from './sections/FaqSection';
import SiteFooter from './sections/SiteFooter';
import NavBar from "@/components/NavBar";

export default async function HomePage() {
   const { home, common } = await getMessages();
   const productImages = Object.fromEntries(PRODUCT_DATA.map(p => [p.articleKey, getProductImages(p.articleKey)[0]]));

   return (
      <div className="min-h-screen flex flex-col bg-[#FDFAF7]">
         <div className="h-svh flex flex-col sq:h-auto">
            <NavBar t={common.nav} />
            <HeroSection t={home.hero} />
         </div>
         <HeroAdvantages t={home.hero} />
         <main className="flex-1">
            <CatalogSection t={home.catalog} productImages={productImages} products={PRODUCT_DATA} />
            <StatsSection t={home.stats} />
            <ReviewsSection t={home.reviews} />
            <GuaranteesSection t={home.guarantees} />
            <FaqSection t={home.faq} />
         </main>
         <SiteFooter t={home.footer} />
      </div>
   );
}
