import { Router } from 'express';
import { getProductsHandler, getProductHandler } from '../controllers/products.controller.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../schemas/index.js';

const router = Router();

router.get('/', getProductsHandler);
router.get('/:id', validate(idParamSchema, 'params'), getProductHandler);

export default router;
