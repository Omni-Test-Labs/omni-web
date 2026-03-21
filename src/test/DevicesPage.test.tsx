import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import DevicesPage from '../pages/DevicesPage';

vi.mock('../../services/api');

describe('Devices Page', () => {
  it('should render devices page title', () => {
    const queryClient = new QueryClient();
    const router = createMemoryRouter([
      {
        path: '/devices',
        element: <DevicesPage />,
      },
    ], {
      initialEntries: ['/devices'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Device Management')).toBeInTheDocument();
  });

  it('should render refresh button', () => {
    const queryClient = new QueryClient();
    const router = createMemoryRouter([
      {
        path: '/devices',
        element: <DevicesPage />,
      },
    ], {
      initialEntries: ['/devices'],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });
});
