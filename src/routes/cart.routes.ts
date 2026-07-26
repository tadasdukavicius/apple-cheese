import { Router } from 'express';
import {
  addToCartHandler,
  getCartHandler,
  updateCartItemHandler,
  removeFromCartHandler,
} from '../controllers/cart.controller';

const router = Router();

router.get('/', getCartHandler);
router.post('/', addToCartHandler);
router.patch('/:productId', updateCartItemHandler);
router.delete('/:productId', removeFromCartHandler);

export default router;
