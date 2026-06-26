const mongoose = require('mongoose');
const Course = require('./models/Course');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/elearning', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample courses data
const sampleCourses = [
    {
        title: "Introduction to Web Development",
        description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners who want to start their journey in web development.",
        instructor: "John Smith",
        price: 49.99,
        duration: "6 weeks",
        enrolledStudents: []
    },
    {
        title: "Advanced React Programming",
        description: "Master React.js with advanced concepts including hooks, context API, and Redux. Build complex applications with modern React practices.",
        instructor: "Sarah Johnson",
        price: 79.99,
        duration: "8 weeks",
        enrolledStudents: []
    },
    {
        title: "Python for Data Science",
        description: "Comprehensive course on Python programming for data science. Learn data analysis, visualization, and machine learning basics.",
        instructor: "Michael Chen",
        price: 69.99,
        duration: "10 weeks",
        enrolledStudents: []
    }
];

// Function to add courses
async function addSampleCourses() {
    try {
        // Clear existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Add new courses
        const addedCourses = await Course.insertMany(sampleCourses);
        console.log(`Successfully added ${addedCourses.length} courses:`);
        addedCourses.forEach(course => console.log(`- ${course.title}`));
    } catch (error) {
        console.error('Error adding sample courses:', error);
    } finally {
        // Close the connection
        mongoose.connection.close();
    }
}

// Run the function
addSampleCourses(); 