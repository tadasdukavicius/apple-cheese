import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ENV } from '../config/env.js';

/** Shape used for every error response: { error: { code, message, details? } } */
export const errorBody = (code: string, message: string, details?: unknown) => ({
  error: { code, message, ...(details ? { details } : {}) },
});

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Kelias nerastas: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json(errorBody(err.code, err.message, err.details));
  }

  // body-parser errors (malformed JSON, payload too large)
  const status = (err as { status?: number })?.status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    return res.status(status).json(errorBody('BAD_REQUEST', 'Neteisinga užklausa'));
  }

  console.error(err);
  res.status(500).json(
    errorBody(
      'INTERNAL_ERROR',
      'Vidinė serverio klaida',
      ENV.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
    )
  );
};
