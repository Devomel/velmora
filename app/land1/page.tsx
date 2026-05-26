import { getMessages } from "@/lib/i18n";
import { PRODUCT_DATA } from '@/lib/products';
import { getProductImages } from '@/lib/product-images';
import { POT_ARTICLE_KEYS } from '@/lib/categories';
import HeroSection, { HeroAdvantages } from '../sections/HeroSection';
import StatsSection from '../sections/StatsSection';
import L1CatalogSection from './components/L1CatalogSection';
import ReviewsSection from '../sections/ReviewsSection';
import GuaranteesSection from '../sections/GuaranteesSection';
import FaqSection from '../sections/FaqSection';
import L1Footer from './components/L1Footer';

export default async function Land1Page() {
   const { home, land1 } = await getMessages();
   const potData = PRODUCT_DATA.filter(p => POT_ARTICLE_KEYS.includes(p.articleKey));
   const productImages = Object.fromEntries(potData.map(p => [p.articleKey, getProductImages(p.articleKey)[0]]));

   return (
      <div className="min-h-screen flex flex-col bg-[#FDFAF7]">
         <div className="lg:h-[calc(100vh-3.5rem)] lg:flex lg:flex-col">
            <HeroSection t={home.hero} />
         </div>
         <HeroAdvantages t={home.hero} />
         <main className="flex-1">
            <L1CatalogSection t={home.catalog} productImages={productImages} products={potData} priceOnly />
            <StatsSection t={home.stats} />
            <ReviewsSection t={home.reviews} />
            <GuaranteesSection t={home.guarantees} />
            <FaqSection t={home.faq} />
         </main>
         <L1Footer t={land1.footer} logoText="Velmora" />
      </div>
   );
}
