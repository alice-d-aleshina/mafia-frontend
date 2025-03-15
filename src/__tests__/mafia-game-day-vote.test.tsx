import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import VotingScreen from '@/pages/mafia-game-day-vote';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('Voting Screen', () => {
  const mockPush = jest.fn();
  const mockSetEliminatedPlayers = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useRoom as jest.Mock).mockReturnValue({
      eliminatedPlayers: [],
      setEliminatedPlayers: mockSetEliminatedPlayers,
      shootPlayer: null,
      mafiaPlayers: [1, 2],
    });
    Object.defineProperty(window, 'location', {
      value: { search: '?candidates=1,2,3&roomId=test-room' }
    });
  });

  it('renders voting screen correctly', () => {
    const { getByText } = render(<VotingScreen />);
    
    expect(getByText('ДЕНЬ')).toBeInTheDocument();
    expect(getByText('Голосовать')).toBeInTheDocument();
    expect(getByText('Ночь')).toBeInTheDocument();
  });

  it('handles vote selection', () => {
    const { getAllByRole } = render(<VotingScreen />);
    
    const voteButtons = getAllByRole('button').slice(0, 11); // кнопки 0-10
    voteButtons[5].click(); // выбираем 5 голосов
    
    expect(voteButtons[5]).toHaveClass('bg-gray-300');
  });

  it('handles night transition', () => {
    const { getByText } = render(<VotingScreen />);
    
    const nightButton = getByText('Ночь');
    nightButton.click();
    
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/mafia-game-night'));
  });

  it('handles voting completion', () => {
    const { getByText, getAllByRole } = render(<VotingScreen />);
    
    const voteButtons = getAllByRole('button').slice(0, 11);
    voteButtons[5].click();
    
    const voteButton = getByText('Голосовать');
    voteButton.click();
    
    expect(getByText('Попил')).toBeInTheDocument();
    expect(getByText('Голосование не состоялось')).toBeInTheDocument();
  });
}); 