import React, { createContext, useContext, useState, useEffect } from 'react';
import { jest } from '@jest/globals';
import { useRouter, useSearchParams } from 'next/navigation';

interface RoomContextType {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  mafiaSelected: number[];
  setMafiaSelected: (players: number[]) => void;
  donSelected: number | null;
  setDonSelected: (player: number | null) => void;
  sheriffSelected: number | null;
  setSheriffSelected: (player: number | null) => void;
  mafiaPlayers: number[];
  setMafiaPlayers: (players: number[]) => void;
  eliminatedPlayers: number[];
  setEliminatedPlayers: (players: number[]) => void;
  shootPlayer: number | null;
  setShootPlayer: (player: number | null) => void;
  playerFouls: { [key: number]: number };
  setPlayerFouls: (fouls: { [key: number]: number }) => void;
  resetGame: () => void;
}

export const mockSetRoomId = jest.fn();
export const mockSetMafiaSelected = jest.fn();
export const mockSetDonSelected = jest.fn();
export const mockSetSheriffSelected = jest.fn();
export const mockSetMafiaPlayers = jest.fn();

export const mockRoomContextValue: RoomContextType = {
  roomId: 'test-room',
  setRoomId: mockSetRoomId,
  mafiaSelected: [],
  setMafiaSelected: mockSetMafiaSelected,
  donSelected: null,
  setDonSelected: mockSetDonSelected,
  sheriffSelected: null,
  setSheriffSelected: mockSetSheriffSelected,
  mafiaPlayers: [],
  setMafiaPlayers: mockSetMafiaPlayers,
  eliminatedPlayers: [],
  setEliminatedPlayers: jest.fn(),
  shootPlayer: null,
  setShootPlayer: jest.fn(),
  playerFouls: {},
  setPlayerFouls: jest.fn(),
  resetGame: jest.fn(),
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlRoomId = searchParams?.get('roomId');
    console.log('URL Room ID:', urlRoomId); // Debug log
    if (urlRoomId && !roomId) {
      setRoomId(urlRoomId);
    }
  }, [searchParams, roomId, setRoomId]);

  const [mafiaSelected, setMafiaSelected] = useState<number[]>([]);
  const [donSelected, setDonSelected] = useState<number | null>(null);
  const [sheriffSelected, setSheriffSelected] = useState<number | null>(null);
  const [mafiaPlayers, setMafiaPlayers] = useState<number[]>([]);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<number[]>([]);
  const [shootPlayer, setShootPlayer] = useState<number | null>(null);
  const [playerFouls, setPlayerFouls] = useState<{ [key: number]: number }>({});

  const resetGame = () => {
    setRoomId(null);
    setMafiaSelected([]);
    setDonSelected(null);
    setSheriffSelected(null);
    setMafiaPlayers([]);
    setEliminatedPlayers([]);
    setShootPlayer(null);
    setPlayerFouls({});
  };

  const value: RoomContextType = {
    roomId,
    setRoomId,
    mafiaSelected,
    setMafiaSelected,
    donSelected,
    setDonSelected,
    sheriffSelected,
    setSheriffSelected,
    mafiaPlayers,
    setMafiaPlayers,
    eliminatedPlayers,
    setEliminatedPlayers,
    shootPlayer,
    setShootPlayer,
    playerFouls,
    setPlayerFouls,
    resetGame,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};