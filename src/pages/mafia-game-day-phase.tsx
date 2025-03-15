import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useRoom } from '@/contexts/RoomContext'

interface Player {
  id: number;
  clicked: boolean;
  violated: number;
}

export default function Component() {
  const { eliminatedPlayers, playerFouls, setPlayerFouls, shootPlayer } = useRoom();
  const [mounted, setMounted] = useState(false);
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 10 }, (_, i) => ({ 
      id: i + 1, 
      clicked: false, 
      violated: playerFouls[i + 1] || 0
    }))
  );
  const [clickedNumbers, setClickedNumbers] = useState<number[]>([]);
  const [time, setTime] = useState('01:00');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [isFlashing, setIsFlashing] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const router = useRouter();

  const longPressTimers = useRef<{ [key: number]: NodeJS.Timeout | null }>({});
  const isLongPress = useRef<{ [key: number]: boolean }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds - 1;

          if (newSeconds === 10) {
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 1000);
          }

          if (newSeconds === 0) {
            setIsFlashing(true);
            setIsRunning(false);
            setRestartCount(prev => prev + 1);
            setTimeout(() => {
              setIsFlashing(false);
              setSeconds(60);
              setTime('01:00');
            }, 1000);
          }

          const minutes = Math.floor(newSeconds / 60);
          const remainingSeconds = newSeconds % 60;
          setTime(`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`);
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, seconds]);

  const handleButtonPress = (playerId: number) => {
    if (eliminatedPlayers.includes(playerId) || playerId === shootPlayer) return;

    // Сбрасываем все таймеры и состояния длинного нажатия
    Object.keys(longPressTimers.current).forEach(key => {
      if (longPressTimers.current[Number(key)]) {
        clearTimeout(longPressTimers.current[Number(key)]!);
        longPressTimers.current[Number(key)] = null;
      }
    });
    Object.keys(isLongPress.current).forEach(key => {
      isLongPress.current[Number(key)] = false;
    });

    // Устанавливаем таймер для длинного нажатия
    longPressTimers.current[playerId] = setTimeout(() => {
      isLongPress.current[playerId] = true;
      const newViolated = ((playerFouls[playerId] || 0) + 1) % 4;
      setPlayerFouls({
        ...playerFouls,
        [playerId]: newViolated
      });
      
      setPlayers(prevPlayers => 
        prevPlayers.map(player => 
          player.id === playerId 
            ? { ...player, violated: newViolated }
            : player
        )
      );
    }, 500);
  }

  const handleButtonRelease = (playerId: number) => {
    if (eliminatedPlayers.includes(playerId) || playerId === shootPlayer) return;
    
    if (longPressTimers.current[playerId]) {
      clearTimeout(longPressTimers.current[playerId]!);
      longPressTimers.current[playerId] = null;
    }

    if (!isLongPress.current[playerId]) {
      setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.map(p => {
          if (p.id === playerId) {
            const newClicked = !p.clicked;
            setTimeout(() => {
              if (newClicked) {
                setClickedNumbers(prev => [...prev, playerId]);
              } else {
                setClickedNumbers(prev => prev.filter(id => id !== playerId));
              }
            }, 0);
            return { ...p, clicked: newClicked };
          }
          return p;
        });
        return updatedPlayers;
      });
    }
    
    isLongPress.current[playerId] = false;
  }

  const handlePhaseTransition = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const roomId = searchParams.get('roomId');
    if (roomId) {
      router.push(`/mafia-game-day-vote?roomId=${roomId}&candidates=${clickedNumbers.join(',')}`);
    } else {
      console.error('Room ID is missing');
    }
  }

  const handleGameEnd = () => {
    router.push('/game-end')
  }

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setSeconds(60);
    setTime('01:00');
    setRestartCount(prev => prev + 1);
    setIsRunning(true);
  };

  const handleSkipVoting = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const roomId = searchParams.get('roomId');
    if (roomId) {
      router.push(`/mafia-game-night?roomId=${roomId}`);
    } else {
      console.error('Room ID is missing');
    }
  }

  const buttonOrder = [5, 6, 4, 7, 3, 8, 2, 9, 1, 10];

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      {isFlashing && (
        <div className="fixed inset-0 bg-red-500/50 pointer-events-none transition-opacity duration-300 z-50" />
      )}

      <div className="w-full max-w-md mx-auto p-4">
        <div className="text-lg font-bold mb-4">Кандидаты: {clickedNumbers.join(', ')}</div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          {buttonOrder.map(id => {
            const player = players.find(p => p.id === id)!;
            const isEliminated = mounted && (eliminatedPlayers.includes(id) || id === shootPlayer);
            return (
              <Button
                key={player.id}
                variant="outline"
                className={`w-full h-12 text-lg font-medium relative ${
                  isEliminated 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : player.clicked 
                      ? 'bg-gray-500' 
                      : ''
                }`}
                onMouseDown={() => handleButtonPress(player.id)}
                onMouseUp={() => handleButtonRelease(player.id)}
                onMouseLeave={() => handleButtonRelease(player.id)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleButtonPress(player.id);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleButtonRelease(player.id);
                }}
                disabled={mounted && (eliminatedPlayers.includes(id) || id === shootPlayer)}
              >
                <div className="absolute top-0 right-0 flex">
                  {[...Array(player.violated)].map((_, index) => (
                    <span key={index} className="text-red-500 mr-1">✖</span>
                  ))}
                </div>
                {player.id}
              </Button>
            );
          })}
        </div>

        <div className="flex space-x-4 mt-6">
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-6"
            onClick={handleSkipVoting}
          >
            Пропуск голосования
          </Button>
          <Button
            className={`flex-1 ${
              clickedNumbers.length > 0 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } text-white font-semibold py-6`}
            onClick={handlePhaseTransition}
            disabled={clickedNumbers.length === 0}
          >
            Голосование
          </Button>
        </div>
      </div>
    </div>
  )
}