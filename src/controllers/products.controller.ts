import type { Request, Response } from 'express';
import type { ProductQuery } from '../schemas/index.js';
import { getAllProducts, getProductById } from '../services/products.service.js';

export const getProductsHandler = async (_req: Request, res: Response) => {
  res.json(await getAllProducts(res.locals.query as ProductQuery));
};

export const getProductHandler = async (req: Request<{ id: string }>, res: Response) => {
  res.json(await getProductById(req.params.id));
};
