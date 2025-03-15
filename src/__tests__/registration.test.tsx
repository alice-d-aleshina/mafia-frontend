import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import Registration from '@/pages/registration';
import { authService } from '@/pages/api/utils/api';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/pages/api/utils/api', () => ({
  authService: {
    register: jest.fn(),
  },
}));

describe('Registration Form', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders registration form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<Registration />);
    
    expect(getByText('Mafia')).toBeInTheDocument();
    expect(getByPlaceholderText('Введите ник')).toBeInTheDocument();
    expect(getByPlaceholderText('Введите пароль')).toBeInTheDocument();
    expect(getByText('Регистрация')).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    (authService.register as jest.Mock).mockResolvedValue({
      data: {
        post: {
          id: '123',
          username: 'testuser',
          role: 'user',
        },
      },
    });
    
    const { getByText, getByPlaceholderText } = render(<Registration />);
    
    const usernameInput = getByPlaceholderText('Введите ник');
    const passwordInput = getByPlaceholderText('Введите пароль');
    const confirmPasswordInput = getByPlaceholderText('Введите пароль');
    const registerButton = getByText('Регистрация');
    
    usernameInput.setAttribute('value', 'testuser');
    passwordInput.setAttribute('value', 'password123');
    confirmPasswordInput.setAttribute('value', 'password123');
    registerButton.click();
    
    expect(authService.register).toHaveBeenCalledWith('testuser', 'password123');
    expect(mockPush).toHaveBeenCalledWith('/mafia-create-game');
  });
}); 