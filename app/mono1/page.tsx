import { getMessages } from '@/lib/i18n';
import { applyDiscount } from '@/lib/products';
import MonoPage from '@/components/mono/MonoPage';

export default async function Mono1Page() {
  const { mono1 } = await getMessages();
  return (
    <MonoPage
      t={mono1}
      newPrice={applyDiscount(89)}
      oldPrice={applyDiscount(183)}
      newPriceLei={applyDiscount(449)}
      oldPriceLei={applyDiscount(919)}
      image="/mono-products/1.jpg"
      source="mono1"
    />
  );
}
