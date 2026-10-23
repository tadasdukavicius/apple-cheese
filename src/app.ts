import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import cartRoutes from './routes/cart.routes.js';
import metaRoutes from './routes/meta.routes.js';
import orderRoutes from './routes/orders.routes.js';
import productRoutes from './routes/products.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: ENV.CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(
  '/api',
  rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false })
);

app.use('/api', metaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
