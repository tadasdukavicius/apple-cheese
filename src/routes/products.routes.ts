import { Router } from 'express';
import {
  getProductsHandler,
  getProductHandler
} from '../controllers/products.controller';

const router = Router();

router.get('/', getProductsHandler);
router.get('/:id', getProductHandler);

export default router;