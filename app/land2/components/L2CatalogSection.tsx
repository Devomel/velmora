'use client';

import { useL2Cart } from './L2CartProvider';
import CatalogSection from '@/app/sections/CatalogSection';
import type { HomeT } from '@/lib/i18n';
import type { ProductData } from '@/lib/products';

type Props = {
  t: HomeT['catalog'];
  productImages: Record<string, string>;
  products: ProductData[];
  priceOnly?: boolean;
};

export default function L2CatalogSection({ t, productImages, products, priceOnly }: Props) {
  const { addItem } = useL2Cart();
  return (
    <CatalogSection
      t={t}
      productImages={productImages}
      products={products}
      productLinkPrefix="/land2/product/"
      priceOnly={priceOnly}
      onAddItem={addItem}
    />
  );
}
