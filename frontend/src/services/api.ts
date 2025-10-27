import axios from 'axios';
import type {
  AuthResponse,
  RegisterData,
  LoginData,
  ChangePasswordData,
  User,
  Tweet,
  CreateTweetData,
} from '../types';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>('/auth/change-password', data);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

// Tweets API
export const tweetsApi = {
  create: async (data: CreateTweetData): Promise<Tweet> => {
    const response = await api.post<Tweet>('/tweets', data);
    return response.data;
  },

  getMyTweets: async (): Promise<Tweet[]> => {
    const response = await api.get<Tweet[]>('/tweets/my-tweets');
    return response.data;
  },

  getSharedWithMe: async (): Promise<Tweet[]> => {
    const response = await api.get<Tweet[]>('/tweets/shared-with-me');
    return response.data;
  },

  getById: async (id: string): Promise<Tweet> => {
    const response = await api.get<Tweet>(`/tweets/${id}`);
    return response.data;
  },
};

export default api;
