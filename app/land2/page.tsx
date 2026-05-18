import { getMessages } from '@/lib/i18n';
import { PRODUCT_DATA } from '@/lib/products';
import L2Hero from './components/L2Hero';
import L2Stats from './components/L2Stats';
import L2Usp from './components/L2Usp';
import L2Benefits from './components/L2Benefits';
import L2Catalog from './components/L2Catalog';
import L2Reviews from './components/L2Reviews';
import L2Offer from './components/L2Offer';
import L2Footer from './components/L2Footer';

const LOGO_TEXT = 'Scarlet Table';

export default async function Land2Page() {
  const { land2 } = await getMessages();

  return (
    <div className="min-h-screen">
      <L2Hero t={land2.hero} />
      <L2Stats items={land2.stats} />
      <L2Usp t={land2.usp} />
      <L2Benefits t={land2.benefits} />
      <L2Catalog t={land2.catalog} data={PRODUCT_DATA} />
      <L2Reviews t={land2.reviews} />
      <L2Offer t={land2.offer} />
      <L2Footer t={land2.footer} logoText={LOGO_TEXT} />
    </div>
  );
}
