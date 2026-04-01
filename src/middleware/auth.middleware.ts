import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';
import { AuthenticatedRequest } from '../types/express';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email || undefined
    };

    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};