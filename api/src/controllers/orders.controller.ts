import type { Request, Response } from 'express';
import { createOrder, getOrder, listOrders, payOrder } from '../services/orders.service.js';
import type { CreateOrderInput } from '../schemas/index.js';

// authMiddleware guarantees req.user on these routes
export const createOrderHandler = async (req: Request, res: Response) => {
  const order = await createOrder(req.user!.token, req.body as CreateOrderInput);
  res.status(201).json(order);
};

export const listOrdersHandler = async (req: Request, res: Response) => {
  const { id, token } = req.user!;
  res.json(await listOrders(id, token));
};

export const getOrderHandler = async (req: Request<{ id: string }>, res: Response) => {
  const { id, token } = req.user!;
  res.json(await getOrder(req.params.id, id, token));
};

export const payOrderHandler = async (req: Request<{ id: string }>, res: Response) => {
  const { id, token } = req.user!;
  res.json(await payOrder(req.params.id, id, token));
};
