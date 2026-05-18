import { getMessages } from '@/lib/i18n';
import { PRODUCT_DATA } from '@/lib/products';
import L1Hero from './components/L1Hero';
import L1Stats from './components/L1Stats';
import L1Usp from './components/L1Usp';
import L1Benefits from './components/L1Benefits';
import L1Catalog from './components/L1Catalog';
import L1Reviews from './components/L1Reviews';
import L1Offer from './components/L1Offer';
import L1Footer from './components/L1Footer';

const LOGO_TEXT = 'Emerald Craft';

export default async function Land1Page() {
  const { land1 } = await getMessages();

  return (
    <div className="min-h-screen">
      <L1Hero t={land1.hero} />
      <L1Stats items={land1.stats} />
      <L1Usp t={land1.usp} />
      <L1Benefits t={land1.benefits} />
      <L1Catalog t={land1.catalog} data={PRODUCT_DATA} />
      <L1Reviews t={land1.reviews} />
      <L1Offer t={land1.offer} />
      <L1Footer t={land1.footer} logoText={LOGO_TEXT} />
    </div>
  );
}
