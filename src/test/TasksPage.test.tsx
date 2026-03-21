import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import TasksPage from '../pages/TasksPage';

vi.mock('../../services/api');

describe('Tasks Page', () => {
  it('should render tasks page title', () => {
    const queryClient = new QueryClient();
    const router = createMemoryRouter([
      {
        path: '/tasks',
        element: <TasksPage />,
      },
    ], {
      initialEntries: ['/tasks'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Task Management')).toBeInTheDocument();
  });

  it('should render create task button', () => {
    const queryClient = new QueryClient();
    const router = createMemoryRouter([
      {
        path: '/tasks',
        element: <TasksPage />,
      },
    ], {
      initialEntries: ['/tasks'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });
});
