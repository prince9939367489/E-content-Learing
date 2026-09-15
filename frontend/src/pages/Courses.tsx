import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../api';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  price: number;
  rating: number;
  studentsEnrolled: number;
}

const Courses: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get('/courses');
      setCourses(response.data.data || []);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Courses could not be loaded. Is the API running?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoadingCourseId(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      window.alert('Successfully enrolled in the course!');
      await fetchCourses();
    } catch (requestError: any) {
      window.alert(requestError.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setLoadingCourseId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Course catalogue</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse courses from the API and sign in when you are ready to enroll.
          </p>
        </header>

        {isLoading && (
          <div className="mt-16 flex justify-center" role="status">
            <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            <span className="sr-only">Loading courses</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="mt-12 mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-center" role="alert">
            <p className="text-red-700">{error}</p>
            <button onClick={fetchCourses} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && courses.length === 0 && (
          <div className="mt-12 rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
            No courses have been published yet. Run the sample-course seed script to populate the catalogue.
          </div>
        )}

        {!isLoading && !error && courses.length > 0 && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article key={course._id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                <img className="h-48 w-full object-cover" src={course.image} alt={`${course.title} course`} />
                <div className="px-4 py-5 sm:p-6 flex flex-1 flex-col">
                  <p className="text-sm font-semibold text-primary">{course.level}</p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">{course.title}</h2>
                  <p className="mt-2 text-sm text-gray-500 flex-1">{course.description}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div><dt className="font-semibold">Instructor</dt><dd>{course.instructor}</dd></div>
                    <div><dt className="font-semibold">Duration</dt><dd>{course.duration}</dd></div>
                    <div><dt className="font-semibold">Rating</dt><dd>{course.rating.toFixed(1)} / 5</dd></div>
                    <div><dt className="font-semibold">Price</dt><dd>{course.price === 0 ? 'Free' : `$${course.price}`}</dd></div>
                  </dl>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    disabled={loadingCourseId === course._id}
                    className={`mt-6 w-full rounded-md px-4 py-2 text-sm font-medium text-white ${loadingCourseId === course._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                  >
                    {loadingCourseId === course._id ? 'Enrolling…' : isAuthenticated ? 'Enroll now' : 'Sign in to enroll'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Courses;
