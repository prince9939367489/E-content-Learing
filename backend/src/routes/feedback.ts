import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import Feedback from '../models/Feedback';
import Course from '../models/Course';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import AppError from '../utils/AppError';
import { validate } from '../middleware/validate';
import catchAsync from '../utils/catchAsync';
import {
  createFeedbackValidation,
  updateFeedbackValidation,
  feedbackIdValidation,
  courseFeedbackValidation
} from '../validations/feedback.validation';

const router = express.Router();

// Submit feedback for a course
const submitFeedback = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { courseId, rating, comment } = authReq.body;

  // Validate course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Check if user has already submitted feedback for this course
  const existingFeedback = await Feedback.findOne({ user: authReq.user._id, course: courseId });
  if (existingFeedback) {
    throw new AppError('You have already submitted feedback for this course', 400);
  }

  // Create new feedback
  const feedback = new Feedback({
    user: authReq.user._id,
    course: courseId,
    rating,
    comment
  });

  await feedback.save();

  // Update course average rating
  const allFeedbacks = await Feedback.find({ course: courseId });
  const averageRating = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / allFeedbacks.length;
  course.rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place
  await course.save();

  res.status(201).json({
    success: true,
    data: {
      feedback: await feedback.populate('user', 'name email')
    },
    message: 'Feedback submitted successfully'
  });
});

// Get all feedback for a course
const getCourseFeedback = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;

  // Validate course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const feedbacks = await Feedback.find({ course: courseId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      feedbacks,
      count: feedbacks.length
    }
  });
});

// Get feedback statistics for a course
const getCourseFeedbackStats = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;

  // Validate course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const feedbacks = await Feedback.find({ course: courseId });

  const stats = {
    totalFeedbacks: feedbacks.length,
    averageRating: 0,
    ratingDistribution: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    }
  };

  if (feedbacks.length > 0) {
    // Calculate average rating
    const totalRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    stats.averageRating = Math.round((totalRating / feedbacks.length) * 10) / 10;

    // Calculate rating distribution
    feedbacks.forEach(feedback => {
      stats.ratingDistribution[feedback.rating as keyof typeof stats.ratingDistribution]++;
    });
  }

  res.json({
    success: true,
    data: stats
  });
});

// Update feedback
const updateFeedback = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { feedbackId } = req.params;
  const { rating, comment } = authReq.body;

  if (rating === undefined && comment === undefined) {
    throw new AppError('Provide a rating or comment to update', 400);
  }

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    throw new AppError('Feedback not found', 404);
  }

  // Check if the feedback belongs to the user
  if (feedback.user.toString() !== authReq.user._id.toString()) {
    throw new AppError('Not authorized to update this feedback', 403);
  }

  if (rating !== undefined) feedback.rating = rating;
  if (comment !== undefined) feedback.comment = comment;
  await feedback.save();

  // Update course average rating
  const course = await Course.findById(feedback.course);
  if (course) {
    const allFeedbacks = await Feedback.find({ course: feedback.course });
    const averageRating = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / allFeedbacks.length;
    course.rating = Math.round(averageRating * 10) / 10;
    await course.save();
  }

  res.json({
    success: true,
    data: {
      feedback: await feedback.populate('user', 'name email')
    },
    message: 'Feedback updated successfully'
  });
});

// Delete feedback
const deleteFeedback = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { feedbackId } = req.params;

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    throw new AppError('Feedback not found', 404);
  }

  // Check if the feedback belongs to the user
  if (feedback.user.toString() !== authReq.user._id.toString()) {
    throw new AppError('Not authorized to delete this feedback', 403);
  }

  await feedback.deleteOne();

  // Update course average rating
  const course = await Course.findById(feedback.course);
  if (course) {
    const allFeedbacks = await Feedback.find({ course: feedback.course });
    if (allFeedbacks.length > 0) {
      const averageRating = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / allFeedbacks.length;
      course.rating = Math.round(averageRating * 10) / 10;
    } else {
      course.rating = 0;
    }
    await course.save();
  }

  res.json({
    success: true,
    message: 'Feedback deleted successfully'
  });
});

// Route handlers with validation
router.post('/course', [auth, validate(createFeedbackValidation)], submitFeedback);
router.get('/course/:courseId', validate(courseFeedbackValidation), getCourseFeedback);
router.get('/course/:courseId/stats', validate(courseFeedbackValidation), getCourseFeedbackStats);
router.put('/:feedbackId', [auth, validate(updateFeedbackValidation)], updateFeedback);
router.delete('/:feedbackId', [auth, validate(feedbackIdValidation)], deleteFeedback);

export default router;
