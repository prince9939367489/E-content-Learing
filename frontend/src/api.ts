import axios from 'axios';

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

interface ApiResponse {
  data: any;
}

interface ApiClient {
  get(path: string): Promise<ApiResponse>;
  post(path: string, body?: any): Promise<ApiResponse>;
}

const liveApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

liveApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const sampleCourses = [
  {
    _id: 'web-foundations',
    title: 'Introduction to Web Development',
    description: 'Learn semantic HTML, modern CSS, and JavaScript by building a complete responsive website.',
    instructor: 'John Smith',
    duration: '6 weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    price: 49.99,
    rating: 4.7,
    studentsEnrolled: 324,
  },
  {
    _id: 'advanced-react',
    title: 'Advanced React Programming',
    description: 'Practice component architecture, hooks, context, testing, and performance techniques in React.',
    instructor: 'Sarah Johnson',
    duration: '8 weeks',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    price: 79.99,
    rating: 4.9,
    studentsEnrolled: 218,
  },
  {
    _id: 'python-data',
    title: 'Python for Data Science',
    description: 'Use Python for data cleaning, visualization, and introductory machine-learning workflows.',
    instructor: 'Michael Chen',
    duration: '10 weeks',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    price: 69.99,
    rating: 4.8,
    studentsEnrolled: 401,
  },
];

const demoUser = (body?: { name?: string; email?: string }) => ({
  _id: 'portfolio-demo-user',
  name: body?.name?.trim() || body?.email?.split('@')[0] || 'Demo learner',
  email: body?.email || 'learner@example.com',
});

const demoApi: ApiClient = {
  async get(path) {
    if (path === '/courses') {
      return { data: { success: true, data: sampleCourses } };
    }

    if (path === '/profile/me') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No demo session is active');
      }
      return { data: { success: true, data: { user: JSON.parse(storedUser) } } };
    }

    throw new Error(`Unsupported demo request: GET ${path}`);
  },

  async post(path, body) {
    if (path === '/auth/login' || path === '/auth/signup') {
      return {
        data: {
          success: true,
          data: { token: 'portfolio-demo-session', user: demoUser(body) },
        },
      };
    }

    if (/^\/courses\/[^/]+\/enroll$/.test(path)) {
      return { data: { success: true, message: 'Demo enrollment saved in this browser session.' } };
    }

    if (path === '/feedback/course') {
      const feedback = JSON.parse(localStorage.getItem('demoFeedback') || '[]');
      feedback.push({ ...body, createdAt: new Date().toISOString() });
      localStorage.setItem('demoFeedback', JSON.stringify(feedback));
      return { data: { success: true } };
    }

    throw new Error(`Unsupported demo request: POST ${path}`);
  },
};

const api: ApiClient = isDemoMode ? demoApi : liveApi;

export default api;
