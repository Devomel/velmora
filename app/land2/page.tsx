import { getMessages } from "@/lib/i18n";
import { PRODUCT_DATA } from '@/lib/products';
import { getProductImages } from '@/lib/product-images';
import { PAN_ARTICLE_KEYS } from '@/lib/categories';
import HeroSection, { HeroAdvantages } from '../sections/HeroSection';
import StatsSection from '../sections/StatsSection';
import CatalogSection from '../sections/CatalogSection';
import ReviewsSection from '../sections/ReviewsSection';
import GuaranteesSection from '../sections/GuaranteesSection';
import FaqSection from '../sections/FaqSection';
import L2Footer from './components/L2Footer';

export default async function Land2Page() {
   const { home, land2 } = await getMessages();
   const panData = PRODUCT_DATA.filter(p => PAN_ARTICLE_KEYS.includes(p.articleKey));
   const productImages = Object.fromEntries(panData.map(p => [p.articleKey, getProductImages(p.articleKey)[0]]));

   return (
      <div className="min-h-screen flex flex-col bg-[#FDFAF7]">
         <div className="lg:h-[calc(100vh-3.5rem)] lg:flex lg:flex-col">
            <HeroSection t={home.hero} />
         </div>
         <HeroAdvantages t={home.hero} />
         <main className="flex-1">
            <CatalogSection t={home.catalog} productImages={productImages} products={panData} productLinkPrefix="/land2/product/" priceOnly />
            <StatsSection t={home.stats} />
            <ReviewsSection t={home.reviews} />
            <GuaranteesSection t={home.guarantees} />
            <FaqSection t={home.faq} />
         </main>
         <L2Footer t={land2.footer} logoText="Velmora" />
      </div>
   );
}
