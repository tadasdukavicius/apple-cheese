export interface ProductVariant {
  id: string;
  product_id: string;
  label: string;
  weight_g: number;
  price: number;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: 'singles' | 'gift_sets';
  features: string[];
  created_at: string;
  variants: ProductVariant[];
}

/** Price of the cheapest size, shown as "from €x" on cards. */
export const startingPrice = (product: Product) =>
  product.variants.length ? Math.min(...product.variants.map((v) => v.price)) : 0;
