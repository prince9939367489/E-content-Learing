"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Feedback_1 = __importDefault(require("../models/Feedback"));
const Course_1 = __importDefault(require("../models/Course"));
const auth_1 = require("../middleware/auth");
const AppError_1 = __importDefault(require("../utils/AppError"));
const validate_1 = require("../middleware/validate");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const feedback_validation_1 = require("../validations/feedback.validation");
const router = express_1.default.Router();
// Submit feedback for a course
const submitFeedback = (0, catchAsync_1.default)(async (req, res) => {
    const authReq = req;
    const { courseId, rating, comment } = authReq.body;
    // Validate course exists
    const course = await Course_1.default.findById(courseId);
    if (!course) {
        throw new AppError_1.default('Course not found', 404);
    }
    // Check if user has already submitted feedback for this course
    const existingFeedback = await Feedback_1.default.findOne({ user: authReq.user._id, course: courseId });
    if (existingFeedback) {
        throw new AppError_1.default('You have already submitted feedback for this course', 400);
    }
    // Create new feedback
    const feedback = new Feedback_1.default({
        user: authReq.user._id,
        course: courseId,
        rating,
        comment
    });
    await feedback.save();
    // Update course average rating
    const allFeedbacks = await Feedback_1.default.find({ course: courseId });
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
const getCourseFeedback = (0, catchAsync_1.default)(async (req, res) => {
    const { courseId } = req.params;
    // Validate course exists
    const course = await Course_1.default.findById(courseId);
    if (!course) {
        throw new AppError_1.default('Course not found', 404);
    }
    const feedbacks = await Feedback_1.default.find({ course: courseId })
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
const getCourseFeedbackStats = (0, catchAsync_1.default)(async (req, res) => {
    const { courseId } = req.params;
    // Validate course exists
    const course = await Course_1.default.findById(courseId);
    if (!course) {
        throw new AppError_1.default('Course not found', 404);
    }
    const feedbacks = await Feedback_1.default.find({ course: courseId });
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
            stats.ratingDistribution[feedback.rating]++;
        });
    }
    res.json({
        success: true,
        data: stats
    });
});
// Update feedback
const updateFeedback = (0, catchAsync_1.default)(async (req, res) => {
    const authReq = req;
    const { feedbackId } = req.params;
    const { rating, comment } = authReq.body;
    const feedback = await Feedback_1.default.findById(feedbackId);
    if (!feedback) {
        throw new AppError_1.default('Feedback not found', 404);
    }
    // Check if the feedback belongs to the user
    if (feedback.user.toString() !== authReq.user._id.toString()) {
        throw new AppError_1.default('Not authorized to update this feedback', 403);
    }
    feedback.rating = rating;
    feedback.comment = comment;
    await feedback.save();
    // Update course average rating
    const course = await Course_1.default.findById(feedback.course);
    if (course) {
        const allFeedbacks = await Feedback_1.default.find({ course: feedback.course });
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
const deleteFeedback = (0, catchAsync_1.default)(async (req, res) => {
    const authReq = req;
    const { feedbackId } = req.params;
    const feedback = await Feedback_1.default.findById(feedbackId);
    if (!feedback) {
        throw new AppError_1.default('Feedback not found', 404);
    }
    // Check if the feedback belongs to the user
    if (feedback.user.toString() !== authReq.user._id.toString()) {
        throw new AppError_1.default('Not authorized to delete this feedback', 403);
    }
    await feedback.deleteOne();
    // Update course average rating
    const course = await Course_1.default.findById(feedback.course);
    if (course) {
        const allFeedbacks = await Feedback_1.default.find({ course: feedback.course });
        if (allFeedbacks.length > 0) {
            const averageRating = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / allFeedbacks.length;
            course.rating = Math.round(averageRating * 10) / 10;
        }
        else {
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
router.post('/course', [auth_1.auth, (0, validate_1.validate)(feedback_validation_1.createFeedbackValidation)], submitFeedback);
router.get('/course/:courseId', (0, validate_1.validate)(feedback_validation_1.courseFeedbackValidation), getCourseFeedback);
router.get('/course/:courseId/stats', (0, validate_1.validate)(feedback_validation_1.courseFeedbackValidation), getCourseFeedbackStats);
router.put('/:feedbackId', [auth_1.auth, (0, validate_1.validate)(feedback_validation_1.updateFeedbackValidation)], updateFeedback);
router.delete('/:feedbackId', [auth_1.auth, (0, validate_1.validate)(feedback_validation_1.feedbackIdValidation)], deleteFeedback);
exports.default = router;
