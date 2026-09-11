import { body, param } from 'express-validator';

export const createCourseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Course title must be between 5 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Course description must be between 20 and 2000 characters'),

  body('instructor')
    .trim()
    .notEmpty()
    .withMessage('Instructor name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Instructor name must be between 2 and 50 characters'),

  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Course duration is required')
    .matches(/^(\d+(\.\d+)?\s*(hour|hours|week|weeks|month|months))$/i)
    .withMessage('Duration must be in format: X hours/weeks/months'),

  body('level')
    .trim()
    .notEmpty()
    .withMessage('Course level is required')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be either Beginner, Intermediate, or Advanced'),

  body('price')
    .notEmpty()
    .withMessage('Course price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('image')
    .trim()
    .notEmpty()
    .withMessage('Course image URL is required')
    .isURL()
    .withMessage('Please provide a valid image URL')
];

export const updateCourseValidation = [
  param('courseId')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Course title must be between 5 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Course description must be between 20 and 2000 characters'),

  body('instructor')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Instructor name must be between 2 and 50 characters'),

  body('duration')
    .optional()
    .trim()
    .matches(/^(\d+(\.\d+)?\s*(hour|hours|week|weeks|month|months))$/i)
    .withMessage('Duration must be in format: X hours/weeks/months'),

  body('level')
    .optional()
    .trim()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be either Beginner, Intermediate, or Advanced'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('image')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid image URL')
];

export const courseIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID')
];
