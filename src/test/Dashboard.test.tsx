import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Dashboard from '../pages/Dashboard';

vi.mock('../../services/api');

describe('Dashboard Page', () => {
  beforeAll(() => {
    // Add jest-dom matchers
    expect.extend({});
  });

  it('should render dashboard title', () => {
    const queryClient = new QueryClient();
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

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should show statistics cards', () => {
    const queryClient = new QueryClient();
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

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Devices')).toBeInTheDocument();
    expect(screen.getByText('Running Tasks')).toBeInTheDocument();
  });

  it('should show recent activity section', () => {
    const queryClient = new QueryClient();
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

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});
