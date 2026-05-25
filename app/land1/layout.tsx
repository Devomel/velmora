import { L1CartProvider } from './components/L1CartProvider';
import L1CartPanel from './components/L1CartPanel';
import L1Header from './components/L1Header';
import { getMessages } from '@/lib/i18n';

const LOGO_TEXT = 'Velmora';

export default async function Land1Layout({ children }: { children: React.ReactNode }) {
  const { land1 } = await getMessages();
  return (
    <L1CartProvider>
      <L1Header logoText={LOGO_TEXT} cartLabel={land1.cart.title} nav={land1.nav} />
      <div className="pt-14" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {children}
      </div>
      <L1CartPanel t={land1.cart} />
    </L1CartProvider>
  );
}
