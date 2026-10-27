import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/AppError.js';

type Source = 'body' | 'params' | 'query';

export const validate =
  (schema: ZodType, source: Source = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(AppError.badRequest('VALIDATION_FAILED', 'Neteisingi duomenys', details));
    }
    if (source === 'body') req.body = result.data;
    // Express 5 exposes req.query as a getter, so parsed values go to res.locals
    else if (source === 'query') res.locals.query = result.data;
    next();
  };
