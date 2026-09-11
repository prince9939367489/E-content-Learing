import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import AppError from '../utils/AppError';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(validations.map((validation: any) => validation.run(req)));
    } catch (error) {
      return next(error);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const messages = errors.array().map((error) => error.msg as string);
    return next(new AppError(`Validation failed: ${messages.join('. ')}`, 400));
  };
};
