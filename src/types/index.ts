export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'apples' | 'cheese' | 'gifts' | 'other';
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

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  currency: 'EUR';
  subtotal: number;
  shipping_price: number;
  tax_price: number;
  total_price: number;
  phone: string;
  shipping_address: Record<string, string>;
  payment_reference: string | null;
  paid_at: string | null;
  created_at: string;
}
