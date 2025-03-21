import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameState {
  mafiaSelected: number[];
  donSelected: number | null;
  sheriffSelected: number | null;
  eliminatedPlayers: number[];
  shootPlayer: number | null;
  playerFouls: { [key: number]: number };
  mafiaPlayers: number[];
  playerNicknames: { id: number; nickname: string }[];
}

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
  
  mafiaPlayers: number[];
  setMafiaPlayers: (players: number[]) => void;
  playerNicknames: { id: number; nickname: string }[];
  setPlayerNicknames: (nicknames: { id: number; nickname: string }[]) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

const getInitialState = (roomId: string | null): GameState => {
  if (!roomId) {
    return {
      mafiaSelected: [],
      donSelected: null,
      sheriffSelected: null,
      eliminatedPlayers: [],
      shootPlayer: null,
      playerFouls: {},
      mafiaPlayers: [],
      playerNicknames: [],
    };
  }

  const savedState = sessionStorage.getItem(`gameState_${roomId}`);
  if (savedState) {
    return JSON.parse(savedState);
  }

  return {
    mafiaSelected: [],
    donSelected: null,
    sheriffSelected: null,
    eliminatedPlayers: [],
    shootPlayer: null,
    playerFouls: {},
    mafiaPlayers: [],
    playerNicknames: [],
  };
};

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>(() => {
    // Try to get roomId from URL on initial load
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('roomId');
    }
    return null;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    // Initialize state from session storage if available
    if (typeof window !== 'undefined' && roomId) {
      const savedState = sessionStorage.getItem(`gameState_${roomId}`);
      if (savedState) {
        return JSON.parse(savedState);
      }
    }
    return getInitialState(null);
  });

  const [playerNicknames, setPlayerNicknamesState] = useState<{ id: number; nickname: string }[]>([]);

  // Update roomId when URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlRoomId = searchParams.get('roomId');
      if (urlRoomId && urlRoomId !== roomId) {
        setRoomId(urlRoomId);
      }
    }
  }, []);

  // Load state from sessionStorage when roomId changes
  useEffect(() => {
    if (roomId) {
      const savedState = sessionStorage.getItem(`gameState_${roomId}`);
      if (savedState) {
        setGameState(JSON.parse(savedState));
      }
    }
  }, [roomId]);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (roomId) {
      sessionStorage.setItem(`gameState_${roomId}`, JSON.stringify(gameState));
    }
  }, [gameState, roomId]);

  const setMafiaSelected = (mafia: number[]) => {
    setGameState(prev => ({ ...prev, mafiaSelected: mafia }));
  };

  const setDonSelected = (don: number | null) => {
    setGameState(prev => ({ ...prev, donSelected: don }));
  };

  const setSheriffSelected = (sheriff: number | null) => {
    setGameState(prev => ({ ...prev, sheriffSelected: sheriff }));
  };

  const setEliminatedPlayers = (players: number[]) => {
    setGameState(prev => ({ ...prev, eliminatedPlayers: players }));
  };

  const setShootPlayer = (player: number | null) => {
    setGameState(prev => ({ ...prev, shootPlayer: player }));
  };

  const setPlayerFouls = (fouls: { [key: number]: number }) => {
    setGameState(prev => ({ ...prev, playerFouls: fouls }));
  };

  const setMafiaPlayers = (players: number[]) => {
    setGameState(prev => ({ ...prev, mafiaPlayers: players }));
  };

  const setPlayerNicknames = (nicknames: { id: number; nickname: string }[]) => {
    setPlayerNicknamesState(nicknames);
  };

  // const resetGame = () => {
  //   if (roomId) {
  //     sessionStorage.removeItem(`gameState_${roomId}`);
  //     setGameState(getInitialState(null));
  //   }
  // };

  return (
    <RoomContext.Provider value={{
      roomId,
      setRoomId,
      mafiaSelected: gameState.mafiaSelected,
      setMafiaSelected,
      donSelected: gameState.donSelected,
      setDonSelected,
      sheriffSelected: gameState.sheriffSelected,
      setSheriffSelected,
      eliminatedPlayers: gameState.eliminatedPlayers,
      setEliminatedPlayers,
      shootPlayer: gameState.shootPlayer,
      setShootPlayer,
      playerFouls: gameState.playerFouls,
      setPlayerFouls,
      mafiaPlayers: gameState.mafiaPlayers,
      setMafiaPlayers,
      playerNicknames,
      setPlayerNicknames,
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