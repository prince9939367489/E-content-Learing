import express, { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import AppError from '../utils/AppError';
import { validate } from '../middleware/validate';
import { courseIdValidation } from '../validations/course.validation';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

// Get all courses
router.get('/', catchAsync(async (req: Request, res: Response) => {
  const courses = await Course.find();
  res.json({
    success: true,
    data: courses
  });
}));

// Get single course
router.get(
  '/:id',
  validate(courseIdValidation),
  catchAsync(async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }
    res.json({
      success: true,
      data: course
    });
  })
);

// Enroll in a course (protected route)
router.post(
  '/:id/enroll',
  [auth, validate(courseIdValidation)],
  catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is already enrolled
    if (authReq.user.enrolledCourses.includes(course._id)) {
      throw new AppError('You are already enrolled in this course', 400);
    }

    // Add course to user's enrolled courses
    authReq.user.enrolledCourses.push(course._id);
    await authReq.user.save();

    // Increment students enrolled count
    course.studentsEnrolled = (course.studentsEnrolled || 0) + 1;
    await course.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  })
);

export default router; 