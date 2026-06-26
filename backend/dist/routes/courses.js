"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Course_1 = __importDefault(require("../models/Course"));
const auth_1 = require("../middleware/auth");
const AppError_1 = __importDefault(require("../utils/AppError"));
const validate_1 = require("../middleware/validate");
const course_validation_1 = require("../validations/course.validation");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const router = express_1.default.Router();
// Get all courses
router.get('/', (0, catchAsync_1.default)(async (req, res) => {
    const courses = await Course_1.default.find();
    res.json({
        success: true,
        data: courses
    });
}));
// Get single course
router.get('/:id', (0, validate_1.validate)(course_validation_1.courseIdValidation), (0, catchAsync_1.default)(async (req, res) => {
    const course = await Course_1.default.findById(req.params.id);
    if (!course) {
        throw new AppError_1.default('Course not found', 404);
    }
    res.json({
        success: true,
        data: course
    });
}));
// Enroll in a course (protected route)
router.post('/:id/enroll', [auth_1.auth, (0, validate_1.validate)(course_validation_1.courseIdValidation)], (0, catchAsync_1.default)(async (req, res) => {
    const authReq = req;
    const course = await Course_1.default.findById(req.params.id);
    if (!course) {
        throw new AppError_1.default('Course not found', 404);
    }
    // Check if user is already enrolled
    if (authReq.user.enrolledCourses.includes(course._id)) {
        throw new AppError_1.default('You are already enrolled in this course', 400);
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
}));
exports.default = router;
