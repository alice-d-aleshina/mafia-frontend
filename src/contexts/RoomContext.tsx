import React, { createContext, useContext, useState } from 'react';

interface RoomContextType {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  mafiaSelected: number[];
  setMafiaSelected: (mafia: number[]) => void;
  donSelected: number | null;
  setDonSelected: (don: number | null) => void;
  sheriffSelected: number | null;
  setSheriffSelected: (sheriff: number | null) => void;
  eliminatedPlayers: number[];
  setEliminatedPlayers: (players: number[]) => void;
  shootPlayer: number | null;
  setShootPlayer: (player: number | null) => void;
  playerFouls: { [key: number]: number };
  setPlayerFouls: (fouls: { [key: number]: number }) => void;
  resetGame: () => void;
  mafiaPlayers: number[];
  setMafiaPlayers: (players: number[]) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [mafiaSelected, setMafiaSelected] = useState<number[]>([]);
  const [donSelected, setDonSelected] = useState<number | null>(null);
  const [sheriffSelected, setSheriffSelected] = useState<number | null>(null);
  
  const [eliminatedPlayers, setEliminatedPlayers] = useState<number[]>([]);

  const [shootPlayer, setShootPlayer] = useState<number | null>(null);
  const [playerFouls, setPlayerFouls] = useState<{ [key: number]: number }>({});
  const [mafiaPlayers, setMafiaPlayers] = useState<number[]>([]);

  const resetGame = () => {
    setEliminatedPlayers([]);
    setMafiaSelected([]);
    setDonSelected(null);
    setSheriffSelected(null);
    setShootPlayer(null);
    setPlayerFouls({});
    setMafiaPlayers([]);
  };

  return (
    <RoomContext.Provider value={{ 
      roomId, 
      setRoomId, 
      mafiaSelected, 
      setMafiaSelected, 
      donSelected, 
      setDonSelected, 
      sheriffSelected, 
      setSheriffSelected, 
      eliminatedPlayers, 
      setEliminatedPlayers,
      shootPlayer, 
      setShootPlayer, 
      playerFouls, 
      setPlayerFouls,
      resetGame,
      mafiaPlayers,
      setMafiaPlayers,
    }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}; 