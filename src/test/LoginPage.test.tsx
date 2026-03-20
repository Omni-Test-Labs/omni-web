import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { message } from 'antd';

import LoginPage from '../pages/LoginPage';

vi.mock('../../services/api');
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

describe('LoginPage', () => {
  beforeAll(() => {
    expect.extend({});
  });

  const mockApi = vi.mocked('../../services/api');
  const mockMessage = vi.mocked(message);

  const renderLoginPage = () => {
    const queryClient = new QueryClient();
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

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toHaveAttribute('loading', 'true');
  });

  it('should navigate to dashboard on successful login', async () => {
    mockApi.post.mockResolvedValue({
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    });

    const { router } = renderLoginPage();

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
      expect(router.state.location.pathname).toBe('/');
    });
  });

  it('should show error message on failed login when API returns empty response', async () => {
    mockApi.post.mockResolvedValue({});

    const { container } = renderLoginPage();

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

  it('should render GitHub OAuth button', () => {
    renderLoginPage();

    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
    const githubButton = screen.getAllByRole('button')[2]; // Third button after Sign In and GitLab
    expect(githubButton).toBeInTheDocument();
  });

  it('should render GitLab OAuth button', () => {
    renderLoginPage();

    expect(screen.getByText('Continue with GitLab')).toBeInTheDocument();
    const gitlabButton = screen.getAllByRole('button')[1]; // Second button after Sign In
    expect(gitlabButton).toBeInTheDocument();
  });

  it('should have password field type as password', () => {
    renderLoginPage();

    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should show register link', () => {
    renderLoginPage();

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });
});
