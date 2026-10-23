import { Router } from 'express';
import {
  addToCartHandler,
  getCartHandler,
  updateCartItemHandler,
  removeFromCartHandler,
} from '../controllers/cart.controller.js';
import { validate } from '../middleware/validate.js';
import {
  addToCartSchema,
  productIdParamSchema,
  updateCartItemSchema,
} from '../schemas/index.js';

const router = Router();

router.get('/', getCartHandler);
router.post('/', validate(addToCartSchema), addToCartHandler);
router.patch(
  '/:productId',
  validate(productIdParamSchema, 'params'),
  validate(updateCartItemSchema),
  updateCartItemHandler
);
router.delete(
  '/:productId',
  validate(productIdParamSchema, 'params'),
  removeFromCartHandler
);

export default router;
