import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { errorBody } from '../middleware/errorHandler.js';
import { validate } from '../middleware/validate.js';
import { contactSchema, type ContactInput } from '../schemas/index.js';
import { saveContactMessage } from '../services/contact.service.js';

const router = Router();

// Public endpoint, so it gets a much tighter limit than the rest of the API
const contactLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: errorBody('RATE_LIMITED', 'Per daug žinučių. Pabandykite vėliau.'),
});

router.post('/', contactLimiter, validate(contactSchema), async (req, res) => {
  const input = req.body as ContactInput;
  // Honeypot filled in: pretend success so bots learn nothing
  if (!input.website) await saveContactMessage(input);
  res.status(201).json({ ok: true });
});

export default router;
