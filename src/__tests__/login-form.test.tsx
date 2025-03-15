import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import LoginForm from '@/pages/login-form';
import { authService } from '@/pages/api/utils/api';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/pages/api/utils/api', () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe('Login Form', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginForm />);
    
    expect(getByText('Mafia')).toBeInTheDocument();
    expect(getByPlaceholderText('Введите ник')).toBeInTheDocument();
    expect(getByPlaceholderText('Введите пароль')).toBeInTheDocument();
    expect(getByText('Войти')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      data: {
        post: {
          id: '123',
          username: 'testuser',
          role: 'admin',
          access_token: 'token123',
        },
      },
    });
    
    const { getByText, getByPlaceholderText } = render(<LoginForm />);
    
    const usernameInput = getByPlaceholderText('Введите ник');
    const passwordInput = getByPlaceholderText('Введите пароль');
    const loginButton = getByText('Войти');
    
    usernameInput.setAttribute('value', 'testuser');
    passwordInput.setAttribute('value', 'password123');
    loginButton.click();
    
    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(mockPush).toHaveBeenCalledWith('/mafia-create-game');
  });

  it('handles login error', async () => {
    (authService.login as jest.Mock).mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    });
    
    const { getByText, getByPlaceholderText } = render(<LoginForm />);
    
    const usernameInput = getByPlaceholderText('Введите ник');
    const passwordInput = getByPlaceholderText('Введите пароль');
    const loginButton = getByText('Войти');
    
    usernameInput.setAttribute('value', 'testuser');
    passwordInput.setAttribute('value', 'password123');
    loginButton.click();
    
    const errorMessage = await getByText('Ошибка при входе: Invalid credentials');
    expect(errorMessage).toBeInTheDocument();
  });

  it('handles network error', async () => {
    (authService.login as jest.Mock).mockRejectedValue({
      code: 'ERR_NETWORK',
      message: 'Network Error'
    });
    
    const { getByText, getByPlaceholderText } = render(<LoginForm />);
    
    const usernameInput = getByPlaceholderText('Введите ник');
    const passwordInput = getByPlaceholderText('Введите пароль');
    const loginButton = getByText('Войти');
    
    usernameInput.setAttribute('value', 'testuser');
    passwordInput.setAttribute('value', 'password123');
    loginButton.click();
    
    const errorMessage = await getByText('Ошибка соединения. Проверьте консоль разработчика.');
    expect(errorMessage).toBeInTheDocument();
  });
}); 