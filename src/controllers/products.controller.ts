import type { Request, Response } from 'express';
import { getAllProducts, getProductById } from '../services/products.service.js';

export const getProductsHandler = async (_req: Request, res: Response) => {
  res.json(await getAllProducts());
};

export const getProductHandler = async (req: Request<{ id: string }>, res: Response) => {
  res.json(await getProductById(req.params.id));
};
