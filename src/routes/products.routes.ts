import { Router } from 'express';
import { getProductsHandler, getProductHandler } from '../controllers/products.controller.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema, productQuerySchema } from '../schemas/index.js';

const router = Router();

router.get('/', validate(productQuerySchema, 'query'), getProductsHandler);
router.get('/:id', validate(idParamSchema, 'params'), getProductHandler);

export default router;
