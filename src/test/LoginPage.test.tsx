import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { message as antdMessage } from 'antd';

import { api } from '../services/api';
import LoginPage from '../pages/LoginPage';

vi.mock('../services/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock('antd', () => ({
  ...require('antd'),
  message: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockMessage = antdMessage as { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

describe('LoginPage', () => {
  const mockApi = vi.mocked(api);

  beforeAll(() => {
    expect.extend({});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const router = createMemoryRouter([
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/',
        element: <div>Dashboard Page</div>,
      },
    ], {
      initialEntries: ['/login'],
    });

    return {
      ...render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      ),
      queryClient,
      router,
    };
  };

  it('should render login form', () => {
    renderLoginPage();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to Omni Test Platform')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should show validation errors when form is empty', async () => {
    const { container } = renderLoginPage();

    // Submit form without filling fields
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please input your username!')).toBeInTheDocument();
      expect(screen.getByText('Please input your password!')).toBeInTheDocument();
    });
  });

  it('should call API with valid credentials', async () => {
    mockApi.post.mockResolvedValue({
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    });

    const { container } = renderLoginPage();

    // Fill in valid credentials
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/auth/login',
        { username: 'testuser', password: 'password123' }
      );
    });
  });

  it('should show loading state during login', async () => {
    mockApi.post.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
      }), 200))
    );

    const { container } = renderLoginPage();

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(submitButton).toHaveClass('ant-btn-loading');
    });

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalled();
    });
  });

  it('should navigate to dashboard on successful login', async () => {
    mockApi.post.mockResolvedValue({
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    });

    const { router } = renderLoginPage();

    // Fill in credentials
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  it('should show error message on failed login when API returns empty response', async () => {
    mockApi.post.mockResolvedValue({});

    const { container } = renderLoginPage();

    // Fill in credentials and submit
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith('Login failed');
    });
  });

  it('should show error message on API error', async () => {
    mockApi.post.mockRejectedValue(new Error('Network error'));

    const { container } = renderLoginPage();

    // Fill in credentials and submit
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith('An error occurred during login');
    });
  });
});
