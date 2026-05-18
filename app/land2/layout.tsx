import { L2CartProvider } from './components/L2CartProvider';
import L2CartPanel from './components/L2CartPanel';
import L2Header from './components/L2Header';
import { getMessages } from '@/lib/i18n';

const LOGO_TEXT = 'Scarlet Table';

export default async function Land2Layout({ children }: { children: React.ReactNode }) {
  const { land2 } = await getMessages();
  return (
    <L2CartProvider>
      <L2Header logoText={LOGO_TEXT} cartLabel={land2.cart.title} />
      <div className="pt-14" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {children}
      </div>
      <L2CartPanel t={land2.cart} />
    </L2CartProvider>
  );
}
