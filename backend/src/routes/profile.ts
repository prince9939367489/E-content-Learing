import express, { Request, Response, NextFunction } from 'express';
import { auth } from '../middleware/auth';
import User from '../models/User';
import { AuthRequest } from '../types/express';
import AppError from '../utils/AppError';

const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user._id).select('-password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 