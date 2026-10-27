import type { Request, Response } from 'express';
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} from '../services/cart.service.js';
import type { AddToCartInput } from '../schemas/index.js';

// authMiddleware guarantees req.user on these routes
export const getCartHandler = async (req: Request, res: Response) => {
  const { id, token } = req.user!;
  res.json(await getCart(id, token));
};

export const addToCartHandler = async (req: Request, res: Response) => {
  const { variantId, quantity } = req.body as AddToCartInput;
  res.status(201).json(await addToCart(variantId, quantity, req.user!.token));
};

export const updateCartItemHandler = async (
  req: Request<{ variantId: string }>,
  res: Response
) => {
  const { id, token } = req.user!;
  const { quantity } = req.body as { quantity: number };
  res.json(await updateCartItemQuantity(id, req.params.variantId, quantity, token));
};

export const removeFromCartHandler = async (
  req: Request<{ variantId: string }>,
  res: Response
) => {
  const { id, token } = req.user!;
  await removeFromCart(id, req.params.variantId, token);
  res.status(204).send();
};
