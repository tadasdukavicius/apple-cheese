import { Router } from 'express';
import productRoutes from "./productRoutes";

export const routes = Router();

routes.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

routes.use("/products", productRoutes);