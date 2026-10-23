export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  features: string[];
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface Pricing {
  currency: 'EUR';
  shipping: number;
  taxRate: number;
}
