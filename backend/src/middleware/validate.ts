import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import AppError from '../utils/AppError';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(validations.map((validation: any) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const extractedErrors: string[] = [];
      errors.array().forEach((err: any) => {
        extractedErrors.push(err.msg as string);
      });

      throw new AppError(`Validation failed: ${extractedErrors.join('. ')}`, 400);
    } catch (error) {
      next(new AppError('Validation failed', 400));
    }
  };
};
