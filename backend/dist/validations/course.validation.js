"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseIdValidation = exports.updateCourseValidation = exports.createCourseValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createCourseValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Course title is required')
        .isLength({ min: 5, max: 100 })
        .withMessage('Course title must be between 5 and 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Course description is required')
        .isLength({ min: 20, max: 2000 })
        .withMessage('Course description must be between 20 and 2000 characters'),
    (0, express_validator_1.body)('instructor')
        .trim()
        .notEmpty()
        .withMessage('Instructor name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Instructor name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('duration')
        .trim()
        .notEmpty()
        .withMessage('Course duration is required')
        .matches(/^(\d+(\.\d+)?\s*(hour|hours|week|weeks|month|months))$/i)
        .withMessage('Duration must be in format: X hours/weeks/months'),
    (0, express_validator_1.body)('level')
        .trim()
        .notEmpty()
        .withMessage('Course level is required')
        .isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Level must be either Beginner, Intermediate, or Advanced'),
    (0, express_validator_1.body)('price')
        .notEmpty()
        .withMessage('Course price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('image')
        .trim()
        .notEmpty()
        .withMessage('Course image URL is required')
        .isURL()
        .withMessage('Please provide a valid image URL')
];
exports.updateCourseValidation = [
    (0, express_validator_1.param)('courseId')
        .isMongoId()
        .withMessage('Invalid course ID'),
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Course title must be between 5 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Course description must be between 20 and 2000 characters'),
    (0, express_validator_1.body)('instructor')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Instructor name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('duration')
        .optional()
        .trim()
        .matches(/^(\d+(\.\d+)?\s*(hour|hours|week|weeks|month|months))$/i)
        .withMessage('Duration must be in format: X hours/weeks/months'),
    (0, express_validator_1.body)('level')
        .optional()
        .trim()
        .isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Level must be either Beginner, Intermediate, or Advanced'),
    (0, express_validator_1.body)('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('image')
        .optional()
        .trim()
        .isURL()
        .withMessage('Please provide a valid image URL')
];
exports.courseIdValidation = [
    (0, express_validator_1.param)('courseId')
        .isMongoId()
        .withMessage('Invalid course ID')
];
