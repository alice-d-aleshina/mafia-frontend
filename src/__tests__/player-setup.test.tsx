import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import PlayerSetup from '@/pages/player-setup';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('Player Setup', () => {
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

  it('renders player setup correctly', () => {
    const { getByText, getAllByPlaceholderText } = render(<PlayerSetup />);
    
    expect(getByText('Введите ники игроков для распределения ролей')).toBeInTheDocument();
    expect(getAllByPlaceholderText('Введите участника')).toHaveLength(10);
    expect(getByText('Начать игру')).toBeInTheDocument();
    expect(getByText('Сохранить игру')).toBeInTheDocument();
  });

  it('handles start game', () => {
    const { getByText, getAllByPlaceholderText } = render(<PlayerSetup />);
    
    const inputs = getAllByPlaceholderText('Введите участника');
    inputs.forEach((input, index) => {
      input.setAttribute('value', `Player${index + 1}`);
    });
    
    const startButton = getByText('Начать игру');
    startButton.click();
    
    expect(mockSetRoomId).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/mafia-game-first-night'));
  });
}); 