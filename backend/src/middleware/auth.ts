import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types/express';
import AppError from '../utils/AppError';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new AppError('No authentication token provided', 401);
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Invalid authentication token format', 401);
    }

    const token = authHeader.slice(7).trim();
    const jwtSecret = process.env.JWT_SECRET;
    if (!token || !jwtSecret) {
      throw new AppError('Authentication is not configured correctly', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError('User not found or token is invalid', 401);
    }

    (req as AuthRequest).user = user;
    (req as AuthRequest).userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token has expired', 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401));
    }
    next(error);
  }
};
