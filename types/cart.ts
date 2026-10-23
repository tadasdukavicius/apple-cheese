import type { Product } from './product';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: Product;
}
