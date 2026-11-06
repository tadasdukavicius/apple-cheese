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
  variantIdParamSchema,
  updateCartItemSchema,
} from '../schemas/index.js';

const router = Router();

router.get('/', getCartHandler);
router.post('/', validate(addToCartSchema), addToCartHandler);
router.patch(
  '/:variantId',
  validate(variantIdParamSchema, 'params'),
  validate(updateCartItemSchema),
  updateCartItemHandler
);
router.delete(
  '/:variantId',
  validate(variantIdParamSchema, 'params'),
  removeFromCartHandler
);

export default router;
