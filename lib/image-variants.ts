// 480px copies of product photos built by scripts/optimize-images.mjs (public/products/sm/).
// Use for cards, thumbnails and the cart; keep the full image for the product gallery.
export function smallImage(src: string): string {
  return src.startsWith('/products/') ? `/products/sm/${src.slice('/products/'.length)}` : src;
}
