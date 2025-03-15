import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import ShotDisplay from '@/pages/mafia-game-shot-display';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('Shot Display', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders shot display with killed player', () => {
    (useRoom as jest.Mock).mockReturnValue({
      roomId: 'test-room',
      shootPlayer: 5,
    });

    const { getByText } = render(<ShotDisplay />);
    
    expect(getByText('Ночь завершилась')).toBeInTheDocument();
    expect(getByText('Игрок 5 был убит мафией!')).toBeInTheDocument();
    expect(getByText('Последнее слово')).toBeInTheDocument();
  });

  it('renders shot display without killed player', () => {
    (useRoom as jest.Mock).mockReturnValue({
      roomId: 'test-room',
      shootPlayer: null,
    });

    const { getByText } = render(<ShotDisplay />);
    
    expect(getByText('Никто не был убит этой ночью.')).toBeInTheDocument();
  });

  it('handles timer controls', () => {
    const { getByText } = render(<ShotDisplay />);
    
    const timer = getByText('01:00');
    timer.click(); // запускаем таймер
    
    expect(timer).toBeInTheDocument();
  });

  it('handles continue to day phase', () => {
    (useRoom as jest.Mock).mockReturnValue({
      roomId: 'test-room',
    });

    const { getByText } = render(<ShotDisplay />);
    
    const continueButton = getByText('Продолжить');
    continueButton.click();
    
    expect(mockPush).toHaveBeenCalledWith('/mafia-game-day-phase?roomId=test-room');
  });
}); 