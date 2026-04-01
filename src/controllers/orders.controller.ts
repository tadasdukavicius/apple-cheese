import { Response } from 'express';
import { createOrder } from '../services/orders.service';
import { AuthenticatedRequest } from '../types/express';

export const createOrderHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const order = await createOrder(userId);

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};