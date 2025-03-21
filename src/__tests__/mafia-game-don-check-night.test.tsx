import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import DonCheckNight from '@/pages/mafia-game-don-check-night';
import { RoomProvider } from '@/contexts/RoomContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(() => ({
    roomId: 'test-room',
    sheriffSelected: 3,
    eliminatedPlayers: [],
  })),
}));

describe('Don Check Night', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders don check screen correctly', () => {
    const { getByText } = render(
      <RoomProvider>
        <DonCheckNight />
      </RoomProvider>
    );
    
    expect(getByText('НОЧЬ')).not.toBeNull();
    expect(getByText('Просыпается Дон и ищет Шерифа')).not.toBeNull();
    expect(getByText('Пропуск')).not.toBeNull();
  });

  it('handles player check', () => {
    const { getAllByRole, getByText } = render(
      <RoomProvider>
        <DonCheckNight />
      </RoomProvider>
    );
    
    const playerButtons = getAllByRole('button').slice(0, 10);
    fireEvent.click(playerButtons[2]); // проверяем игрока 3 (шериф)
    
    expect(getByText('Игрок 6 не шериф')).not.toBeNull();
  });

  it('handles skip check', () => {
    const { getByText } = render(
      <RoomProvider>
        <DonCheckNight />
      </RoomProvider>
    );
    
    const skipButton = getByText('Пропуск');
    fireEvent.click(skipButton);
    
    expect(skipButton.classList.contains('bg-red-700')).not.toBe(true);
  });
}); 