import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useAuthStore } from '../stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.access_token).toBeNull();
    expect(result.current.refresh_token).toBeNull();
  });

  it('should set user', () => {
    const { result } = renderHook(() => useAuthStore());
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
    };

    act(() => {
      result.current.setUser(user);
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should set tokens', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setTokens('test-access', 'test-refresh');
    });

    expect(result.current.access_token).toBe('test-access');
    expect(result.current.refresh_token).toBe('test-refresh');
  });

  it('should clear user on logout', () => {
    const { result } = renderHook(() => useAuthStore());
    const user = { id: 1, username: 'test', email: 'test@test.com', role: 'user' };

    act(() => {
      result.current.setUser(user);
      result.current.setTokens('token', 'refresh');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.access_token).toBeNull();
    expect(result.current.refresh_token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
