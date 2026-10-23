import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { AppError } from '../utils/AppError.js';

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;

  if (!token) return next(AppError.unauthorized('No token provided'));

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return next(AppError.unauthorized('Invalid token'));

  req.user = { id: data.user.id, email: data.user.email, token };
  next();
};
