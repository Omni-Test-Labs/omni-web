import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Dashboard from '../pages/Dashboard';

vi.mock('../services/dashboardApi', () => ({
  apiService: {
    dashboard: {
      getStats: vi.fn().mockResolvedValue({
        totalUsers: 100,
        activeDevices: 50,
        runningTasks: 10,
        pendingTasks: 5,
        completedTasks: 200,
        failedTasks: 2,
      }),
    },
    tasks: {
      list: vi.fn().mockResolvedValue([]),
    },
    devices: {
      list: vi.fn().mockResolvedValue([]),
    },
  },
}));

describe('Dashboard Page', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard title', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Dashboard />,
      },
    ], {
      initialEntries: ['/'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('should show statistics cards', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Dashboard />,
      },
    ], {
      initialEntries: ['/'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Active Devices')).toBeInTheDocument();
      expect(screen.getByText('Running Tasks')).toBeInTheDocument();
    });
  });

  it('should show recent tasks section', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Dashboard />,
      },
    ], {
      initialEntries: ['/'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
    });
  });
});
