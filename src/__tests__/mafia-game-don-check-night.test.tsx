import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import DonCheckNight from '@/pages/mafia-game-don-check-night';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('Don Check Night', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useRoom as jest.Mock).mockReturnValue({
      roomId: 'test-room',
      sheriffSelected: 3,
      eliminatedPlayers: [],
    });
  });

  it('renders don check screen correctly', () => {
    const { getByText } = render(<DonCheckNight />);
    
    expect(getByText('НОЧЬ')).toBeInTheDocument();
    expect(getByText('Просыпается Дон и ищет Шерифа')).toBeInTheDocument();
    expect(getByText('Пропуск')).toBeInTheDocument();
  });

  it('handles player check', () => {
    const { getAllByRole, getByText } = render(<DonCheckNight />);
    
    const playerButtons = getAllByRole('button').slice(0, 10);
    playerButtons[2].click(); // проверяем игрока 3 (шериф)
    
    expect(getByText('Игрок 3 шериф')).toBeInTheDocument();
  });

  it('handles skip check', () => {
    const { getByText } = render(<DonCheckNight />);
    
    const skipButton = getByText('Пропуск');
    skipButton.click();
    
    expect(getByText('Пропуск')).toHaveClass('bg-red-700');
  });
}); 