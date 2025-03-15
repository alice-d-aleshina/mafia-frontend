import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import DayPhase from '@/pages/mafia-game-day-phase';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('Day Phase', () => {
  const mockPush = jest.fn();
  const mockSetPlayerFouls = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useRoom as jest.Mock).mockReturnValue({
      eliminatedPlayers: [],
      playerFouls: {},
      setPlayerFouls: mockSetPlayerFouls,
      shootPlayer: null,
    });
  });

  it('renders day phase correctly', () => {
    const { getByText } = render(<DayPhase />);
    
    expect(getByText('ДЕНЬ')).toBeInTheDocument();
    expect(getByText('Пропуск голосования')).toBeInTheDocument();
    expect(getByText('Голосование')).toBeInTheDocument();
  });

  it('handles player selection', () => {
    const { getAllByRole } = render(<DayPhase />);
    
    const playerButtons = getAllByRole('button').slice(0, 10); // первые 10 кнопок - игроки
    playerButtons[0].click();
    
    expect(getByText('Кандаты: 1')).toBeInTheDocument();
  });

  it('handles voting transition', () => {
    const { getByText, getAllByRole } = render(<DayPhase />);
    
    const playerButtons = getAllByRole('button').slice(0, 10);
    playerButtons[0].click();
    
    const voteButton = getByText('Голосование');
    voteButton.click();
    
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/mafia-game-day-vote'));
  });
}); 