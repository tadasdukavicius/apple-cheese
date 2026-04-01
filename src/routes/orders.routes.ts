import { Router } from 'express';
import { createOrderHandler } from '../controllers/orders.controller';

const router = Router();

router.post('/', createOrderHandler);

export default router;