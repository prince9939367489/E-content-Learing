import { body, param } from 'express-validator';

export const createFeedbackValidation = [
  body('courseId')
    .notEmpty()
    .withMessage('Course ID is required')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Comment must be between 3 and 1000 characters')
];

export const updateFeedbackValidation = [
  param('feedbackId')
    .isMongoId()
    .withMessage('Invalid feedback ID'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('comment')
    .optional()
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Comment must be between 3 and 1000 characters')
];

export const feedbackIdValidation = [
  param('feedbackId')
    .isMongoId()
    .withMessage('Invalid feedback ID')
];

export const courseFeedbackValidation = [
  param('courseId')
    .isMongoId()
    .withMessage('Invalid course ID')
]; 