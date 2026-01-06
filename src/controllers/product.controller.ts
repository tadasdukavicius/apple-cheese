import { products } from "../data/mockProducts";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  features: Array<string>
}

export const getProducts = (req: any, res: { json: (data: Product[]) => void }) => {
  res.json(products);
};

export const getProductById = (req: any, res: any) => {
  const id = req.params.id;
  const product = products.find(p => p.id === id);
  if (!product) return res.json({ message: "Product not found" });
  res.json(product);
};