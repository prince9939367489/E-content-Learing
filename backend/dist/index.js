"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const courses_1 = __importDefault(require("./routes/courses"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const AppError_1 = __importDefault(require("./utils/AppError"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/courses', courses_1.default);
app.use('/api/feedback', feedback_1.default);
// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to E-Learning API' });
});
// 404 handler - should be before error handler
app.all('*', (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handling middleware
app.use(globalErrorHandler_1.default);
// Database connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/elearn';
        await mongoose_1.default.connect(uri);
        console.log('Connected to MongoDB:', {
            database: mongoose_1.default.connection.name,
            host: mongoose_1.default.connection.host,
            port: mongoose_1.default.connection.port
        });
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
