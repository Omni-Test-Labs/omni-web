import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LoginPage from '../pages/LoginPage';

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  return {
    ...actual,
    message: {
      ...actual.message,
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

vi.mock('../services/api', async () => {
  return {
    api: {
      post: vi.fn(),
    },
    post: vi.fn(),
  };
});

describe('LoginPage', () => {
  let mockApi: any;

  beforeAll(() => {
    expect.extend({});
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    const apiModule = await import('../services/api');
    // The mocked module has both 'api' and 'post' exports
    mockApi = apiModule.api || apiModule.post || vi.fn();
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
        '/api/auth/login',
        { username: 'testuser', password: 'password123' }
      );
    });
  });

  it('should show loading state during login', async () => {
    mockApi.post.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
      }), 100))
    );

    const { container } = renderLoginPage();

    // Fill in credentials and submit
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Check that button is loading
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveText('Signing in...');
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
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
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
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
