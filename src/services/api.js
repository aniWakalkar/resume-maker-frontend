import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);
export const googleAuth = (token) => api.post('/auth/google', { token });
export const getProfile = () => api.get('/auth/profile');

// Resume API
export const saveResumeToBackend = (resumeData) => api.post('/resumes', resumeData);
export const updateResumeOnBackend = (id, resumeData) => api.put(`/resumes/${id}`, resumeData);
export const getUserResumesFromBackend = () => api.get('/resumes');
export const getResumeByIdFromBackend = (id) => api.get(`/resumes/${id}`);
export const deleteResumeFromBackend = (id) => api.delete(`/resumes/${id}`);

// Template API - ADD ALL THESE FUNCTIONS
export const getAllTemplates = () => api.get('/templates');
export const getFreeTemplates = () => api.get('/templates/free');
export const getPremiumTemplates = () => api.get('/templates/premium');
export const getTemplateById = (id) => api.get(`/templates/${id}`);
export const getTemplateBySlug = (slug) => api.get(`/templates/slug/${slug}`);
export const getTemplatesByCategory = (category) => api.get(`/templates/category/${category}`);
export const getTemplateCategories = () => api.get('/templates/categories');
export const getAllCategories = () => api.get('/templates/categories/all');
export const incrementTemplateDownload = (id) => api.put(`/templates/${id}/download`);

// Payment API
export const createQRPayment = (amount, templateId) => api.post('/payments/create-qr', { amount, templateId });
export const verifyQRPayment = (paymentId, transactionId) => api.post('/payments/verify-qr', { paymentId, transactionId });
export const getPaymentStatus = (paymentId) => api.get(`/payments/status/${paymentId}`);
export const getPurchasedTemplates = () => api.get('/payments/purchased');

export default api;