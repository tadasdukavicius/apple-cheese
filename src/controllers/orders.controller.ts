import type { Request, Response } from 'express';
import { createOrder } from '../services/orders.service.js';
import type { CreateOrderInput } from '../schemas/index.js';

export const createOrderHandler = async (req: Request, res: Response) => {
  const order = await createOrder(req.user!.token, req.body as CreateOrderInput);
  res.status(201).json(order);
};
