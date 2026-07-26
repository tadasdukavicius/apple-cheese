import { Response } from 'express';
import { addToCart, getCart, updateCartItemQuantity, removeFromCart } from '../services/cart.service';
import { AuthenticatedRequest } from '../types/express.d';
import { AddToCartDTO } from '../types/cart.types';

export const addToCartHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, quantity } = req.body as AddToCartDTO;
    const result = await addToCart(userId, productId, quantity, req.user!.token);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCartHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await getCart(userId, req.user!.token);

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItemHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { productId } = req.params;
    const { quantity } = req.body as { quantity: number };

    const result = await updateCartItemQuantity(userId, productId, quantity, req.user!.token);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCartHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { productId } = req.params;
    await removeFromCart(userId, productId, req.user!.token);

    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
