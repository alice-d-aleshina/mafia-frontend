import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import FirstNight from '@/pages/mafia-game-first-night';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

describe('First Night', () => {
  const mockPush = jest.fn();
  const mockSetMafiaSelected = jest.fn();
  const mockSetDonSelected = jest.fn();
  const mockSetSheriffSelected = jest.fn();
  const mockSetMafiaPlayers = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('test-room'),
    });
    (useRoom as jest.Mock).mockReturnValue({
      roomId: 'test-room',
      mafiaSelected: [],
      setMafiaSelected: mockSetMafiaSelected,
      donSelected: null,
      setDonSelected: mockSetDonSelected,
      sheriffSelected: null,
      setSheriffSelected: mockSetSheriffSelected,
      setMafiaPlayers: mockSetMafiaPlayers,
    });
  });

  it('renders first night setup correctly', () => {
    const { getByText } = render(<FirstNight />);
    
    expect(getByText('Распределение Ролей')).toBeInTheDocument();
    expect(getByText('Мафия')).toBeInTheDocument();
    expect(getByText('Дон')).toBeInTheDocument();
    expect(getByText('Шериф')).toBeInTheDocument();
  });

  it('handles role selection', () => {
    const { getAllByRole } = render(<FirstNight />);
    
    const buttons = getAllByRole('button');
    // Выбираем мафию
    buttons[1].click();
    buttons[2].click();
    expect(mockSetMafiaSelected).toHaveBeenCalled();
    
    // Выбираем дона
    buttons[11].click();
    expect(mockSetDonSelected).toHaveBeenCalled();
    
    // Выбираем шерифа
    buttons[21].click();
    expect(mockSetSheriffSelected).toHaveBeenCalled();
  });
}); 