import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Users Page', () => {
  const mockListUsers = vi.fn().mockResolvedValue({
    users: [],
    total: 0,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.doMock('../services/dashboardApi', () => ({
      apiService: {
        users: {
          list: mockListUsers,
        },
      },
    }));
  });

  it('should render users page title', async () => {
    const { default: UsersPage } = await import('../pages/UsersPage');
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UsersPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });
  });

  it('should render create user button', async () => {
    const { default: UsersPage } = await import('../pages/UsersPage');
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UsersPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Create User')).toBeInTheDocument();
    });
  });
});
