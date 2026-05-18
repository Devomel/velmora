import { getMessages } from "@/lib/i18n";
import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import CatalogSection from './sections/CatalogSection';
import ReviewsSection from './sections/ReviewsSection';
import GuaranteesSection from './sections/GuaranteesSection';
import FaqSection from './sections/FaqSection';
import LeadCaptureSection from './sections/LeadCaptureSection';
import SiteHeader from './sections/SiteHeader';
import SiteFooter from './sections/SiteFooter';
import NavBar from "@/components/NavBar";

export default async function HomePage() {
   const { home, common } = await getMessages();

   return (
      <div className="min-h-screen flex flex-col bg-[#FDFAF7]">
         <NavBar t={common.nav} />
         <main className="flex-1">
            <HeroSection t={home.hero} />
            <CatalogSection t={home.catalog} />
            <StatsSection t={home.stats} />
            <ReviewsSection t={home.reviews} />
            <GuaranteesSection t={home.guarantees} />
            <FaqSection t={home.faq} />
            <LeadCaptureSection t={home.leadCapture} />
         </main>
         <SiteFooter t={home.footer} />
      </div>
   );
}
