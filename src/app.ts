import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import cartRoutes from './routes/cart.routes';
import productRoutes from './routes/products.routes';
import orderRoutes from './routes/orders.routes';
import { authMiddleware } from './middleware/auth.middleware';

const app = express();

app.use(helmet());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);


app.use('/api/products', productRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);

export default app;