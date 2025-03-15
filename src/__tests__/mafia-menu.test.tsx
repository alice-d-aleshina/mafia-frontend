import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import MafiaMenu from '@/pages/mafia-menu';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Mafia Menu', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders menu correctly', () => {
    const { getByText } = render(<MafiaMenu />);
    
    expect(getByText('Mafia')).toBeInTheDocument();
    expect(getByText('Войти')).toBeInTheDocument();
    expect(getByText('Регистрация')).toBeInTheDocument();
    expect(getByText('Турнирная таблица')).toBeInTheDocument();
  });

  it('navigates to login page', () => {
    const { getByText } = render(<MafiaMenu />);
    
    const loginButton = getByText('Войти');
    loginButton.click();
    
    expect(mockPush).toHaveBeenCalledWith('/login-form');
  });

  it('navigates to registration page', () => {
    const { getByText } = render(<MafiaMenu />);
    
    const registerButton = getByText('Регистрация');
    registerButton.click();
    
    expect(mockPush).toHaveBeenCalledWith('/registration');
  });
}); 