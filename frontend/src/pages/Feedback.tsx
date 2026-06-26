import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';

interface Course {
  _id: string;
  title: string;
  instructor: string;
  description: string;
  level: string;
}

const Feedback: React.FC = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCourses();
  }, [isAuthenticated, navigate]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching courses...');
      const response = await axios.get('http://localhost:5000/api/courses');
      
      if (response.data && Array.isArray(response.data)) {
        console.log('Courses fetched:', response.data);
        setCourses(response.data);
      } else {
        console.log('No courses found in response:', response.data);
        setError('No courses available');
      }
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(error.response?.data?.message || 'Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCourseId) {
      setError('Please select a course');
      return;
    }

    if (!message.trim()) {
      setError('Please enter your feedback message');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/feedback/course',
        {
          courseId: selectedCourseId,
          rating,
          comment: message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data) {
        setSuccess('Thank you for your feedback!');
        setMessage('');
        setRating(5);
        setSelectedCourseId('');
      }
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Course Feedback
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Help us improve our courses by sharing your experience and suggestions.
              </p>
            </div>

            {courses.length === 0 && !isLoading && !error && (
              <div className="mt-4 text-sm text-gray-500">
                No courses are available at the moment.
              </div>
            )}

            <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
                  {success}
                </div>
              )}

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                  Select Course *
                </label>
                <div className="mt-1">
                  {isLoading ? (
                    <div className="text-gray-500 flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading courses...
                    </div>
                  ) : (
                    <select
                      id="course"
                      name="course"
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      required
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title} - {course.level}
                        </option>
                      ))}
                    </select>
                  )}
                  {selectedCourseId && courses.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      {courses.find(c => c._id === selectedCourseId)?.description}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Rating *
                </label>
                <div className="mt-1">
                  <select
                    id="rating"
                    name="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Your Feedback *
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Please share your experience with this course..."
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading || courses.length === 0}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                    ${(isSubmitting || isLoading || courses.length === 0)
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 