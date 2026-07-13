import { getMessages } from '@/lib/i18n';
import { applyDiscount } from '@/lib/products';
import MonoPage from '@/components/mono/MonoPage';

export default async function Mono2Page() {
  const { mono2 } = await getMessages();
  return (
    <MonoPage
      t={mono2}
      newPrice={applyDiscount(37)}
      oldPrice={applyDiscount(68)}
      newPriceLei={applyDiscount(189)}
      oldPriceLei={applyDiscount(339)}
      image="/mono-products/2.jpg"
      source="mono2"
    />
  );
}
