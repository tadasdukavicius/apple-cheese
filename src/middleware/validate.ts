import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/AppError.js';

type Source = 'body' | 'params' | 'query';

export const validate =
  (schema: ZodType, source: Source = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(AppError.badRequest('Validation failed', details));
    }
    if (source === 'body') req.body = result.data;
    next();
  };
