import axios, { type AxiosInstance, AxiosError } from 'axios';
import { api } from '../config/api';
import type { ApiResponse } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: api.prefix,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.client.post(api.auth.refresh, {
                refresh_token: refreshToken,
              });

              const { access_token } = response.data;
              localStorage.setItem('access_token', access_token);

              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // HTTP GET
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // HTTP POST
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // HTTP PUT
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // HTTP DELETE
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url);
      return response.data;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // Error handling
  private handleError<T>(error: unknown): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response) {
        return {
          success: false,
          message: axiosError.response.data?.message || 'Request failed',
          error: axiosError.response.data?.error || 'Unknown error',
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: 'No response from server',
          error: 'Network error',
        };
      } else {
      return {
        success: false,
        message: 'Request setup error',
        error: 'Unknown error',
      };
      }
    } else {
      return {
        success: false,
        message: 'Unknown error occurred',
        error: (error as Error).message,
      };
    }
  }
}

export const apiService = new ApiService();
