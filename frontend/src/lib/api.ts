import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    register: (data: { email: string; password: string; full_name: string }) =>
        api.post('/auth/register', data),

    login: (data: { username: string; password: string }) =>
        api.post('/auth/login', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),

    getMe: () => api.get('/auth/me'),

    refresh: () => api.post('/auth/refresh'),
};

// Images API
export const imagesApi = {
    generate: (data: { prompt: string; size?: string; style?: string }) =>
        api.post('/images/generate', data),

    generateBanner: (data: { title: string; subtitle?: string; platform: string; style: string }) =>
        api.post('/images/banner', data),

    generateLogo: (data: { brand_name: string; industry: string; style: string; colors?: string[] }) =>
        api.post('/images/logo', data),

    removeBackground: (data: { image_url: string }) =>
        api.post('/images/remove-background', data),

    getHistory: (limit = 20, offset = 0) =>
        api.get(`/images/history?limit=${limit}&offset=${offset}`),
};

// Videos API
export const videosApi = {
    generate: (data: { topic: string; script?: string; duration?: number; style?: string; voice?: string }) =>
        api.post('/videos/generate', data),

    generatePresenter: (data: { script: string; avatar_id: string; background?: string; voice_id?: string }) =>
        api.post('/videos/presenter', data),

    generateVoiceover: (data: { text: string; voice?: string; speed?: number }) =>
        api.post('/videos/voiceover', data),

    getStatus: (id: string) =>
        api.get(`/videos/${id}/status`),

    getHistory: (limit = 20, offset = 0) =>
        api.get(`/videos/history?limit=${limit}&offset=${offset}`),
};

// Users API
export const usersApi = {
    getCredits: () => api.get('/users/credits'),

    updateProfile: (data: { full_name?: string; avatar_url?: string; company?: string }) =>
        api.patch('/users/me', data),

    getHistory: (limit = 50, offset = 0) =>
        api.get(`/users/history?limit=${limit}&offset=${offset}`),

    getStats: () => api.get('/users/stats'),
};

// Admin API
export const adminApi = {
    getUsers: (limit = 50, offset = 0) =>
        api.get(`/admin/users?limit=${limit}&offset=${offset}`),

    getUser: (id: string) =>
        api.get(`/admin/users/${id}`),

    updateUser: (id: string, data: { is_active?: boolean; role?: string; credits?: number }) =>
        api.patch(`/admin/users/${id}`, data),

    adjustCredits: (id: string, data: { amount: number; reason: string }) =>
        api.post(`/admin/users/${id}/credits`, data),

    deleteUser: (id: string) =>
        api.delete(`/admin/users/${id}`),

    getAnalytics: () =>
        api.get('/admin/analytics'),
};

export default api;
