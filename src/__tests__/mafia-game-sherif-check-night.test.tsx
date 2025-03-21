import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import SheriffCheckNight from '@/pages/mafia-game-sherif-check-night';
import { RoomProvider } from '@/contexts/RoomContext';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useRoom hook
jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(() => ({
    roomId: 'test-room',
    donSelected: 2,
    mafiaPlayers: [1, 2],
    eliminatedPlayers: [],
    shootPlayer: null,
  })),
}));

describe('Sheriff Check Night', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders sheriff check screen correctly', () => {
    const { getByText } = render(
      <RoomProvider>
        <SheriffCheckNight />
      </RoomProvider>
    );
    
    expect(getByText('НОЧЬ')).not.toBeNull();
    expect(getByText('Просыпается Шериф и ищет Мафию')).not.toBeNull();
    expect(getByText('Пропуск')).not.toBeNull();
  });

  it('handles mafia check', () => {
    const { getAllByRole, getByText } = render(
      <RoomProvider>
        <SheriffCheckNight />
      </RoomProvider>
    );
    
    const playerButtons = getAllByRole('button').slice(0, 10);
    playerButtons[1].click(); // проверяем игрока 2 (дон)
    
    expect(getByText('2')).not.toBeNull();
  });

  it('handles civilian check', () => {
    const { getAllByRole, getByText } = render(
      <RoomProvider>
        <SheriffCheckNight />
      </RoomProvider>
    );
    
    const playerButtons = getAllByRole('button').slice(0, 10);
    playerButtons[4].click(); // проверяем игрока 5 (мирный)
    
    expect(getByText('5')).not.toBeNull();
  });
}); 