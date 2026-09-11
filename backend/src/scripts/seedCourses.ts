import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course';

const sampleCourses = [
  {
    title: 'Introduction to Web Development',
    description: 'Learn the foundations of semantic HTML, modern CSS, and JavaScript by building a complete responsive website.',
    instructor: 'John Smith',
    duration: '6 weeks',
    level: 'Beginner' as const,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    price: 49.99
  },
  {
    title: 'Advanced React Programming',
    description: 'Practice component architecture, hooks, context, state management, testing, and performance techniques in React.',
    instructor: 'Sarah Johnson',
    duration: '8 weeks',
    level: 'Advanced' as const,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    price: 79.99
  },
  {
    title: 'Python for Data Science',
    description: 'Use Python for data cleaning, exploratory analysis, visualization, and introductory machine-learning workflows.',
    instructor: 'Michael Chen',
    duration: '10 weeks',
    level: 'Intermediate' as const,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    price: 69.99
  }
];

async function seedCourses(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Copy .env.example to .env before seeding.');
  }

  await mongoose.connect(mongoUri);

  const result = await Course.bulkWrite(
    sampleCourses.map((course) => ({
      updateOne: {
        filter: { title: course.title },
        update: {
          $set: course,
          $setOnInsert: { rating: 0, studentsEnrolled: 0 }
        },
        upsert: true
      }
    }))
  );

  console.log(`Sample courses ready: ${result.upsertedCount} added, ${result.modifiedCount} updated.`);
}

seedCourses()
  .catch((error: unknown) => {
    console.error('Unable to seed courses:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
