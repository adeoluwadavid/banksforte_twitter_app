import { describe, it, expect } from 'vitest';
import authReducer, { logout, clearError, setUser } from './authSlice';
import type { User } from '../../types';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: '2024-01-01T10:00:00Z',
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle logout', () => {
    const previousState = {
      user: mockUser,
      token: 'some-token',
      loading: false,
      error: null,
    };

    expect(authReducer(previousState, logout())).toEqual({
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  });

  it('should handle clearError', () => {
    const previousState = {
      ...initialState,
      error: 'Some error',
    };

    expect(authReducer(previousState, clearError())).toEqual(initialState);
  });

  it('should handle setUser', () => {
    expect(authReducer(initialState, setUser(mockUser))).toEqual({
      ...initialState,
      user: mockUser,
    });
  });
});
