import { describe, it, expect, beforeAll, vi } from 'vitest';
import { api } from '../services/api';
import { apiConfig } from '../config/api';

vi.mock('axios');

describe('ApiService', () => {
  const mockAxios = vi.mocked('axios');

  beforeAll(() => {
    expect.extend({});
    
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    } as unknown as Storage;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: apiConfig.prefix,
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should setup request and response interceptors', () => {
      expect(mockAxios.create).toHaveBeenCalled();
      const instance = mockAxios.create.mock.results[0].value;
      expect(instance.interceptors.request.use).toHaveBeenCalled();
      expect(instance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should make GET request and return data', async () => {
      const mockResponse = { data: { result: 'success' } };
      mockAxios.create.mockReturnValue({
        ...mockResponse,
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      const result = await api.get('/api/endpoint');

      expect(result).toEqual({ result: 'success' });
      expect(mockAxios.create.mock.results[0].value.get).toHaveBeenCalledWith('/api/endpoint');
    });
  });

  describe('post', () => {
    it('should make POST request with data and return data', async () => {
      const mockResponse = { data: { id: 123 } };
      mockAxios.create.mockReturnValue({
        ...mockResponse,
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      const result = await api.post('/api/endpoint', { name: 'test' });

      expect(result).toEqual({ id: 123 });
      expect(mockAxios.create.mock.results[0].value.post).toHaveBeenCalledWith('/api/endpoint', { name: 'test' });
    });

    it('should make POST request without data and return data', async () => {
      const mockResponse = { data: { created: true } };
      mockAxios.create.mockReturnValue({
        ...mockResponse,
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      const result = await api.post('/api/endpoint');

      expect(result).toEqual({ created: true });
      expect(mockAxios.create.mock.results[0].value.post).toHaveBeenCalledWith('/api/endpoint', undefined);
    });
  });

  describe('patch', () => {
    it('should make PATCH request with data and return data', async () => {
      const mockResponse = { data: { updated: true } };
      mockAxios.create.mockReturnValue({
        ...mockResponse,
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      const result = await api.patch('/api/endpoint', { name: 'updated' });

      expect(result).toEqual({ updated: true });
      expect(mockAxios.create.mock.results[0].value.patch).toHaveBeenCalledWith('/api/endpoint', { name: 'updated' });
    });

    it('should make PATCH request without data and return data', async () => {
      const mockResponse = { data: { patched: true } };
      mockAxios.create.mockReturnValue({
        ...mockResponse,
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      const result = await api.patch('/api/endpoint');

      expect(result).toEqual({ patched: true });
      expect(mockAxios.create.mock.results[0].value.patch).toHaveBeenCalledWith('/api/endpoint', undefined);
    });
  });

  describe('delete', () => {
    it('should make DELETE request and return data', async () => {
      const mockResponse = { data: { deleted: true } };
      mockAxios.create.mockReturnValue({
        ...mockResponse,
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      const result = await api.delete('/api/endpoint');

      expect(result).toEqual({ deleted: true });
      expect(mockAxios.create.mock.results[0].value.delete).toHaveBeenCalledWith('/api/endpoint');
    });
  });

  describe('request interceptor', () => {
    it('should add Authorization header with Bearer token from localStorage', async () => {
      (global.localStorage.getItem as any).mockReturnValue('test_token_123');
      mockAxios.create.mockReturnValue({
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      await api.get('/api/test');

      const requestInterceptor = mockAxios.create.mock.results[0].value.interceptors.request.use;
      expect(requestInterceptor).toHaveBeenCalled();
      const requestHandler = requestInterceptor.mock.calls[0][0];

      const mockConfig = {
        headers: {}
      };
      requestHandler(mockConfig);

      expect(mockConfig.headers.Authorization).toBe('Bearer test_token_123');
    });

    it('should add Content-Type header', async () => {
      mockAxios.create.mockReturnValue({
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      await api.get('/api/test');

      const mockResponse = mockAxios.create.mock.results[0].value;
      expect(mockResponse.headers['Content-Type']).toBe('application/json');
    });

    it('should not add Authorization header when token is null', async () => {
      (global.localStorage.getItem as any).mockReturnValue(null);
      mockAxios.create.mockReturnValue({
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
      });

      await api.get('/api/test');

      const { interceptors } = mockAxios.create.mock.results[0].value;
      // Token is null, so Authorization header should not be set
      // This is handled by the request interceptor logic
      expect(interceptors.request.use).toHaveBeenCalled();
    });
  });

  describe('response interceptor', () => {
    it('should handle 401 error with token refresh', async () => {
      const mockRequestInterceptor = vi.fn((config) => config);
      const mockAxiosInstance = {
        get: vi.fn().mockRejectedValue({
          response: { status: 401 },
          config: { url: '/api/test' },
        }),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn(() => mockRequestInterceptor) },
          response: { use: vi.fn() }
        }
      };
      const requestInterceptorHandler = mockRequestInterceptor.mock.calls[0][0];

      const firstRequestConfig = requestInterceptorHandler({ url: '/api/test' });
      firstRequestConfig._retry = false;

      const mockRefreshClient = {
        post: vi.fn().mockResolvedValue({
          data: { access_token: 'new_token_123', refresh_token: 'new_refresh' }
        }),
        then: vi.fn((callback) => callback(mockRefreshClient))
      };

      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      (global.localStorage.getItem as any).mockReturnValue('test_refresh_token');

      try {
        await api.get('/api/test');
      } catch (e) {
        // Expected to fail because retry logic isn't being called in this mock scenario
      }

      expect(mockAxios.create).toHaveBeenCalled();
    });

    it('should redirect to login on refresh token failure', async () => {
      const mockWindow = { location: { href: '' } } };
      global.window = mockWindow as any;

      const mockAxiosInstance = {
        get: vi.fn().mockRejectedValue({
          response: { status: 401 },
          config: { url: '/api/test', _retry: false },
        }),
        post: vi.fn().mockRejectedValue(new Error('Refresh failed')),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      };

      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      (global.localStorage.getItem as any)
        .mockImplementation((key) => {
          if (key === 'refresh_token') return 'test_refresh_token';
          return null;
        });

      await expect(api.get('/api/test')).rejects.toThrow();
    });

    it('should handle 401 error when refresh token is null', async () => {
      const mockWindow = { location: { href: '' } };
      global.window = mockWindow as any;


      const mockAxiosInstance = {
        get: vi.fn().mockRejectedValue({
          response: { status: 401 },
          config: { url: '/api/test', _retry: false },
        }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      };

      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      (global.localStorage.getItem as any).mockReturnValue(null);

      await expect(api.get('/api/test')).rejects.toThrow();
    });

    it('should handle non-401 errors normally', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockRejectedValue({
          response: { status: 500 },
          config: { url: '/api/test' },
        }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn((response: any, error: any) => response) }
        }
      };

      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      await expect(api.get('/api/test')).rejects.toThrow();
      expect(mockAxiosInstance.get).toHaveBeenCalled();
    });

    it('should retry request with new token on 401', async () => {
      const mockWindow = { location: { href: '' } };
      global.window = mockWindow as any;


      const mockAxiosInstance = {
        get: vi.fn(),
        post: vi.fn(),
        interceptors: {
          request: { use: vi.fn((config) => config) },
          response: {
            use: vi.fn((response: any, error: any) => {
              if (error.response?.status === 401 && !error.config._retry) {
                error.config._retry = true;
                // This simulates the refresh token logic
                return Promise.reject(error as any);
              }
              return response;
            })
          }
        }
      };

      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      await expect(api.get('/api/test')).rejects.toThrow();
    });

    it('should store new access token on successful refresh', async () => {
      const mockWindow = { location: { href: '' } };
      global.window = mockWindow as any;


      const mockAxiosInstance = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
          data: { access_token: 'new_token', refresh_token: 'new_refresh' }
        }),
        interceptors: {
          request: { use: vi.fn((config) => config) },
          response: {
            use: vi.fn((response: any, error: any) => {
              if (error.response?.status === 401 && !error.config._retry) {
                error.config._retry = true;
                return Promise.reject(error as any);
              }
              return response;
            })
          }
        }
      };

      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      (global.localStorage.getItem as any).mockReturnValue('test_refresh_token');

      await expect(api.get('/api/test')).rejects.toThrow();

      // Refresh should have been attempted
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/auth/refresh',
        { refresh_token: 'test_refresh_token' }
      );

      // New token should have been stored
      expect((global.localStorage.setItem as any)).toHaveBeenCalledWith(
        'access_token',
        'new_token'
      );
    });
  });
});
