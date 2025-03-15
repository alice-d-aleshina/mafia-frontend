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

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { role: 'user' },
            error: null,
          }),
        }),
      }),
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'test',
        password: 'password123',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      post: {
        id: '123',
        username: 'test',
        role: 'user',
        access_token: 'token123',
      },
    });
  });

  it('handles login failure', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'test',
        password: 'wrong',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid credentials',
    });
  });
}); 