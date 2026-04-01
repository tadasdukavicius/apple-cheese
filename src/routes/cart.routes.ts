import { Router } from 'express';
import {
  addToCartHandler,
  getCartHandler
} from '../controllers/cart.controller';

const router = Router();

router.get('/', getCartHandler);
router.post('/', addToCartHandler);

export default router;