import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import SheriffCheckNight from '@/pages/mafia-game-sherif-check-night';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('Sheriff Check Night', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useRoom as jest.Mock).mockReturnValue({
      roomId: 'test-room',
      donSelected: 2,
      mafiaPlayers: [1, 2],
      eliminatedPlayers: [],
      shootPlayer: null,
    });
  });

  it('renders sheriff check screen correctly', () => {
    const { getByText } = render(<SheriffCheckNight />);
    
    expect(getByText('НОЧЬ')).toBeInTheDocument();
    expect(getByText('Просыпается Шериф и ищет Мафию')).toBeInTheDocument();
    expect(getByText('Пропуск')).toBeInTheDocument();
  });

  it('handles mafia check', () => {
    const { getAllByRole, getByText } = render(<SheriffCheckNight />);
    
    const playerButtons = getAllByRole('button').slice(0, 10);
    playerButtons[1].click(); // проверяем игрока 2 (дон)
    
    expect(getByText('Игрок 2 Чёрный')).toBeInTheDocument();
  });

  it('handles civilian check', () => {
    const { getAllByRole, getByText } = render(<SheriffCheckNight />);
    
    const playerButtons = getAllByRole('button').slice(0, 10);
    playerButtons[4].click(); // проверяем игрока 5 (мирный)
    
    expect(getByText('Игрок 5 Красный')).toBeInTheDocument();
  });
}); 