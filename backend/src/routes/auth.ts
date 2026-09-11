import express, { Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { loginValidation, registerValidation } from '../validations/auth.validation';
import User, { IUser } from '../models/User';
import { Types } from 'mongoose';
import Profile from '../models/Profile';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

interface UserResponse {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  role: string;
  enrolledCourses: Types.ObjectId[] | string[];
  createdAt: Date;
  updatedAt: Date;
  password?: string;
}

// Signup route
router.post(
  '/signup',
  validate(registerValidation),
  catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Create user profile
    const profile = new Profile({
      user: user._id,
      avatar: `https://www.gravatar.com/avatar/${user._id}?d=mp`
    });
    await profile.save();

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from response
    const userResponse = user.toObject() as UserResponse;
    delete (userResponse as any).password;

    const profileResponse = profile.toObject();

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        profile: profileResponse,
        token
      }
    });
  })
);

// Login route
router.post(
  '/login',
  validate(loginValidation),
  catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Get or create user profile
    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      profile = new Profile({
        user: user._id,
        avatar: `https://www.gravatar.com/avatar/${user._id}?d=mp`
      });
      await profile.save();
    }

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from response
    const userResponse = user.toObject() as UserResponse;
    delete (userResponse as any).password;

    const profileResponse = profile.toObject();

    res.json({
      success: true,
      data: {
        user: userResponse,
        profile: profileResponse,
        token
      }
    });
  })
);

export default router;
