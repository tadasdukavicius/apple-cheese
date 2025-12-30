import { Router } from 'express';

export const routes = Router();

// Example route
routes.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});