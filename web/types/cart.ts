export interface CartItem {
  id: string;
  variant_id: string;
  quantity: number;
  product_variants: {
    id: string;
    label: string;
    weight_g: number;
    price: number;
    products: { id: string; name: string; image_url: string };
  };
}
