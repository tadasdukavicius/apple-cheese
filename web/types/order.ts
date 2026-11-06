export interface OrderItem {
  id: string;
  product_name: string;
  variant_label: string;
  image_url: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: string;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  currency: 'EUR';
  subtotal: number;
  shipping_price: number;
  tax_price: number;
  total_price: number;
  phone: string;
  shipping_address: {
    street: string;
    houseNumber: string;
    flat?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  created_at: string;
  order_items: OrderItem[];
}
