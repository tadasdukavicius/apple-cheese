import { Router } from 'express';
import {
  createOrderHandler,
  getOrderHandler,
  listOrdersHandler,
  payOrderHandler,
} from '../controllers/orders.controller.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, idParamSchema } from '../schemas/index.js';

const router = Router();

router.get('/', listOrdersHandler);
router.post('/', validate(createOrderSchema), createOrderHandler);
router.get('/:id', validate(idParamSchema, 'params'), getOrderHandler);
router.post('/:id/pay', validate(idParamSchema, 'params'), payOrderHandler);

export default router;
