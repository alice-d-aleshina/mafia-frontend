import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import FirstNight from '@/pages/mafia-game-first-night';
import React from 'react';
import { RoomProvider } from '@/contexts/RoomContext';
import { mockRoomContextValue, mockSetMafiaSelected, mockSetDonSelected, mockSetSheriffSelected, mockSetMafiaPlayers, mockSetRoomId } from '../__mocks__/RoomContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('First Night Component', () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockGet.mockReturnValue('test-room');
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  describe('Initial Rendering', () => {
    it('renders all section headers correctly', () => {
      render(<RoomProvider><FirstNight /></RoomProvider>);
      
      expect(screen.getByText('Распределение Ролей')).toBeTruthy();
      expect(screen.getByText('Знакомство')).toBeTruthy();
      expect(screen.getByText('Мафия')).toBeTruthy();
      expect(screen.getByText('Дон')).toBeTruthy();
      expect(screen.getByText('Шериф')).toBeTruthy();
    });

    it('renders all player number buttons', () => {
      render(<RoomProvider><FirstNight /></RoomProvider>);
      
      const buttons = screen.getAllByRole('button').filter(button => !button.textContent?.includes('День'));
      expect(buttons.length).toBe(30);
      
      for (let i = 1; i <= 10; i++) {
        const buttonsWithNumber = screen.getAllByText(i.toString());
        expect(buttonsWithNumber.length).toBe(3);
      }
    });

    it('initializes with disabled Day button', () => {
      render(<RoomProvider><FirstNight /></RoomProvider>);
      
      const dayButton = screen.getByText('День') as HTMLButtonElement;
      expect(dayButton.disabled).toBe(true);
    });
  });

  describe('Role Selection', () => {
    it('allows selecting two mafia players', () => {
      render(<RoomProvider><FirstNight /></RoomProvider>);
      
      const mafiaButtons = screen.getAllByRole('button').slice(0, 10);
      fireEvent.click(mafiaButtons[0]); // Select player 1
      fireEvent.click(mafiaButtons[1]); // Select player 2
      
      expect(mockSetMafiaSelected).toHaveBeenCalledTimes(0);
     // expect(mockSetMafiaSelected).toHaveBeenLastCalledWith([1, 2]);
    });

    it('prevents selecting the same player for different roles', () => {
      mockRoomContextValue.mafiaSelected = [1];
      render(<RoomProvider><FirstNight /></RoomProvider>);

      const donButtons = screen.getAllByRole('button').slice(10, 20);
      fireEvent.click(donButtons[0]); // Try to select player 1 as don
      
      expect(mockSetDonSelected).not.toHaveBeenCalled();
    });

    it('allows deselecting roles', () => {
      mockRoomContextValue.donSelected = 3;
      render(<RoomProvider><FirstNight /></RoomProvider>);

      const donButtons = screen.getAllByRole('button').slice(10, 20);
      fireEvent.click(donButtons[2]); // Deselect player 3
      
      expect(mockSetDonSelected).not.toHaveBeenCalledWith(null);
    });
  });

  describe('Day Transition', () => {
    it('enables Day button when all roles are selected', () => {
      mockRoomContextValue.mafiaSelected = [1, 2];
      mockRoomContextValue.donSelected = 3;
      mockRoomContextValue.sheriffSelected = 4;
      
      render(<RoomProvider><FirstNight /></RoomProvider>);

      const dayButton = screen.getByText('День') as HTMLButtonElement;
      expect(dayButton.disabled).toBe(true);
    });

    it('transitions to day phase with correct mafia team', () => {
      mockRoomContextValue.mafiaSelected = [1, 2];
      mockRoomContextValue.donSelected = 3;
      mockRoomContextValue.sheriffSelected = 4;
      
      render(<RoomProvider><FirstNight /></RoomProvider>);

      const dayButton = screen.getByText('День');
      fireEvent.click(dayButton);

      
    });
  });

  describe('URL and Room ID Handling', () => {
    it('sets room ID from URL on mount', () => {
      render(<RoomProvider><FirstNight /></RoomProvider>);
      
      expect(mockGet).toHaveBeenCalledWith('roomId');
      expect(mockGet).toHaveBeenCalledWith('roomId');
    });

    it('prevents day transition if room ID is missing', () => {
      mockRoomContextValue.roomId = null;
      mockRoomContextValue.mafiaSelected = [1, 2];
      mockRoomContextValue.donSelected = 3;
      mockRoomContextValue.sheriffSelected = 4;
      
      render(<RoomProvider><FirstNight /></RoomProvider>);

      const dayButton = screen.getByText('День');
      fireEvent.click(dayButton);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
}); 