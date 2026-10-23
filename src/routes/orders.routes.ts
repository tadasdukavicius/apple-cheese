import { Router } from 'express';
import { createOrderHandler } from '../controllers/orders.controller.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../schemas/index.js';

const router = Router();

router.post('/', validate(createOrderSchema), createOrderHandler);

export default router;
