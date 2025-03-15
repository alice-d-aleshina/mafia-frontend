import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import JoinGame from '@/pages/join-game';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('Join Game', () => {
  const mockPush = jest.fn();
  const mockSetRoomId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useRoom as jest.Mock).mockReturnValue({
      setRoomId: mockSetRoomId,
    });
  });

  it('renders join game screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(<JoinGame />);
    
    expect(getByText('Mafia')).toBeInTheDocument();
    expect(getByPlaceholderText('Введите код игры')).toBeInTheDocument();
    expect(getByText('Начать игру')).toBeInTheDocument();
  });

  it('handles game code input', () => {
    const { getByPlaceholderText } = render(<JoinGame />);
    
    const input = getByPlaceholderText('Введите код игры');
    input.setAttribute('value', '1234');
    
    expect(input).toHaveValue('1234');
  });

  it('handles join game', () => {
    const { getByText, getByPlaceholderText } = render(<JoinGame />);
    
    const input = getByPlaceholderText('Введите код игры');
    const joinButton = getByText('Начать игру');
    
    input.setAttribute('value', '1234');
    joinButton.click();
    
    expect(mockSetRoomId).toHaveBeenCalledWith('1234');
    expect(mockPush).toHaveBeenCalledWith('/mafia-game-night-phase');
  });
}); 