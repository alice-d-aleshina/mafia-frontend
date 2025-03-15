import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import GameEnd from '@/pages/game-end';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Game End', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders mafia win correctly', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?winner=mafia' }
    });
    
    const { getByText } = render(<GameEnd />);
    
    expect(getByText('Победила команда черных (мафия)!')).toBeInTheDocument();
    expect(getByText('В главное меню')).toBeInTheDocument();
  });

  it('renders citizens win correctly', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?winner=citizens' }
    });
    
    const { getByText } = render(<GameEnd />);
    
    expect(getByText('Победила команда красных (мирные жители)!')).toBeInTheDocument();
  });

  it('handles menu navigation', () => {
    const { getByText } = render(<GameEnd />);
    
    const menuButton = getByText('В главное меню');
    menuButton.click();
    
    expect(mockPush).toHaveBeenCalledWith('/mafia-create-game');
  });
}); 