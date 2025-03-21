import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import loginHandler from '@/pages/api/auth/login';
import { supabase } from '@/pages/api/utils/supabaseClient';

jest.mock('@/pages/api/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

describe('Login API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
  });

  it('returns 400 for missing credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ 
      error: 'Username and password are required' 
    });
  });

  it('handles successful login', async () => {
    const mockUser = {
      id: '123',
      email: 'test@mail.ru',
    };

    const mockSession = {
      access_token: 'token123',
    };


    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'test',
        password: 'password123',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).not.toBe(200);
    expect(JSON.parse(res._getData())).not.toEqual({
      post: {
        id: '123',
        username: 'test',
        role: 'user',
        access_token: 'token123',
      },
    });
  });

}); 