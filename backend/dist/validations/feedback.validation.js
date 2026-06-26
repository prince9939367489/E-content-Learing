"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseFeedbackValidation = exports.feedbackIdValidation = exports.updateFeedbackValidation = exports.createFeedbackValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createFeedbackValidation = [
    (0, express_validator_1.body)('courseId')
        .notEmpty()
        .withMessage('Course ID is required')
        .isMongoId()
        .withMessage('Invalid course ID'),
    (0, express_validator_1.body)('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    (0, express_validator_1.body)('comment')
        .notEmpty()
        .withMessage('Comment is required')
        .trim()
        .isLength({ min: 3, max: 1000 })
        .withMessage('Comment must be between 3 and 1000 characters')
];
exports.updateFeedbackValidation = [
    (0, express_validator_1.param)('feedbackId')
        .isMongoId()
        .withMessage('Invalid feedback ID'),
    (0, express_validator_1.body)('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    (0, express_validator_1.body)('comment')
        .optional()
        .trim()
        .isLength({ min: 3, max: 1000 })
        .withMessage('Comment must be between 3 and 1000 characters')
];
exports.feedbackIdValidation = [
    (0, express_validator_1.param)('feedbackId')
        .isMongoId()
        .withMessage('Invalid feedback ID')
];
exports.courseFeedbackValidation = [
    (0, express_validator_1.param)('courseId')
        .isMongoId()
        .withMessage('Invalid course ID')
];
