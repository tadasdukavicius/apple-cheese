import express from 'express';
import { z } from 'zod';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { errorBody, errorHandler, notFound } from './middleware/errorHandler.js';
import contactRoutes from './routes/contact.routes.js';
import cartRoutes from './routes/cart.routes.js';
import metaRoutes from './routes/meta.routes.js';
import orderRoutes from './routes/orders.routes.js';
import productRoutes from './routes/products.routes.js';

// Validation details are shown to shoppers, so use zod's Lithuanian messages
z.config(z.locales.lt());

const app = express();

app.use(helmet());
app.use(cors({ origin: ENV.CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(
  '/api',
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: errorBody('RATE_LIMITED', 'Per daug užklausų. Pabandykite vėliau.'),
  })
);

app.use('/api', metaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
