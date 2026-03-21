import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import UsersPage from '../pages/UsersPage';

vi.mock('../../services/api');
vi.mock('../../stores/authStore');

describe('Users Page', () => {
  it('should render users page title', () => {
    const queryClient = new QueryClient();
    const router = createMemoryRouter([
      {
        path: '/users',
        element: <UsersPage />,
      },
    ], {
      initialEntries: ['/users'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('should render create user button', () => {
    const queryClient = new QueryClient();
    const router = createMemoryRouter([
      {
        path: '/users',
        element: <UsersPage />,
      },
    ], {
      initialEntries: ['/users'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Create User')).toBeInTheDocument();
  });
});
