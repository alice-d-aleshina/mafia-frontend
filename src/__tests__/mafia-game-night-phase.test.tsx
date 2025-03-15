import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import NightPhase from '@/pages/mafia-game-shut-night';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('Night Phase', () => {
  const mockPush = jest.fn();
  const mockSetShootPlayer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useRoom as jest.Mock).mockReturnValue({
      eliminatedPlayers: [],
      setShootPlayer: mockSetShootPlayer,
      mafiaPlayers: [1, 2],
    });
  });

  it('renders night phase correctly', () => {
    const { getByText } = render(<NightPhase />);
    
    expect(getByText('НОЧЬ')).toBeInTheDocument();
    expect(getByText('Выстрел мафии')).toBeInTheDocument();
    expect(getByText('К проверке Дона')).toBeInTheDocument();
  });

  it('handles player shooting', () => {
    const { getAllByRole, getByText } = render(<NightPhase />);
    
    const playerButtons = getAllByRole('button').slice(0, 10);
    playerButtons[0].click();
    
    const confirmButton = getByText('К проверке Дона');
    confirmButton.click();
    
    expect(mockSetShootPlayer).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/mafia-game-don-check-night'));
  });
}); 