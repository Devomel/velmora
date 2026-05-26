'use client';

import { useL1Cart } from './L1CartProvider';
import CatalogSection from '@/app/sections/CatalogSection';
import type { HomeT } from '@/lib/i18n';
import type { ProductData } from '@/lib/products';

type Props = {
  t: HomeT['catalog'];
  productImages: Record<string, string>;
  products: ProductData[];
  priceOnly?: boolean;
};

export default function L1CatalogSection({ t, productImages, products, priceOnly }: Props) {
  const { addItem } = useL1Cart();
  return (
    <CatalogSection
      t={t}
      productImages={productImages}
      products={products}
      productLinkPrefix="/land1/product/"
      priceOnly={priceOnly}
      onAddItem={addItem}
    />
  );
}
