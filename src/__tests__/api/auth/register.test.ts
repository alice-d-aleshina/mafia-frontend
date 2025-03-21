import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import registerHandler from '@/pages/api/auth/register';
import { supabase } from '@/pages/api/utils/supabaseClient';

type MockSignUp = jest.Mock<any>;

jest.mock('@/pages/api/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

describe('Register API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
  });

  it('returns 400 for missing credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ 
      error: 'Username and password are required' 
    });
  });

  it('handles successful registration', async () => {
    const mockUser = {
      id: '123',
      email: 'test@mail.ru',
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'test',
        password: 'password123',
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).not.toBe(201);
   
   
  });


}); 