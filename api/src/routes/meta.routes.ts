import { Router } from 'express';
import { PRICING } from '../config/pricing.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

router.get('/pricing', (_req, res) => {
  res.json(PRICING);
});

export default router;
