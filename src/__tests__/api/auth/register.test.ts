import { createMocks } from 'node-mocks-http';
import registerHandler from '@/pages/api/auth/register';
import { supabase } from '@/pages/api/utils/supabaseClient';

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

    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'test',
        password: 'password123',
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({
      post: {
        id: '123',
        username: 'test',
        role: 'admin',
      },
    });
  });

  it('handles registration failure', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Email already exists' },
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'test',
        password: 'password123',
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Email already exists',
    });
  });

  it('handles server errors', async () => {
    (supabase.auth.signUp as jest.Mock).mockRejectedValue(new Error('Server error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'test',
        password: 'password123',
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'An error occurred during registration',
    });
  });
}); 