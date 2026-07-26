import { Response } from 'express';
import { createOrder } from '../services/orders.service';
import { AuthenticatedRequest } from '../types/express';

export const createOrderHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { phone, shippingAddress } = req.body;

    if (!phone || !shippingAddress) {
      return res.status(400).json({ error: 'Phone and shipping address are required' });
    }

    const order = await createOrder(userId, req.user!.token, phone, shippingAddress);

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
