import { Response } from 'express';
import { addToCart, getCart } from '../services/cart.service';
import { AuthenticatedRequest } from '../types/express.d';
import { AddToCartDTO } from '../types/cart.types';

export const addToCartHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, quantity } = req.body as AddToCartDTO;

    const result = await addToCart(userId, productId, quantity);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCartHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await getCart(userId);

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};