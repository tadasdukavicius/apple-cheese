import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById
} from '../services/products.service';

export const getProductsHandler = async (_req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};