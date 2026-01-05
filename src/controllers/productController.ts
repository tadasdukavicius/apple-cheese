import { products } from "../data/mockProducts";

export const getProducts = (req: any, res: { json: (arg0: { id: number; name: string; price: string; description: string; }[]) => void; }) => {
  res.json(products);
};