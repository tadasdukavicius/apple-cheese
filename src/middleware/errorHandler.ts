import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ENV } from '../config/env.js';

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
  }

  // body-parser errors (malformed JSON, payload too large)
  const status = (err as { status?: number })?.status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    return res.status(status).json({ error: { message: 'Bad request' } });
  }

  console.error(err);
  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      ...(ENV.NODE_ENV === 'development' && err instanceof Error ? { details: err.message } : {}),
    },
  });
};
