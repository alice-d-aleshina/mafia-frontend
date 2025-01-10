import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import { Button } from "@/components/ui/button"

const ShotDisplay = () => {
  const router = useRouter();
  const { roomId, shootPlayer } = useRoom();
  const [time, setTime] = useState('01:00');
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

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

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setSeconds(60);
    setTime('01:00');
    setIsRunning(true);
  };

  const handleContinue = () => {
    router.push(`/mafia-game-day-phase?roomId=${roomId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-800 text-white items-center justify-center">
      {isFlashing && (
        <div className="fixed inset-0 bg-red-500/50 pointer-events-none transition-opacity duration-300 z-50" />
      )}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Ночь завершилась</h1>
        {shootPlayer ? (
          <h2 className="text-2xl">Игрок {shootPlayer} был убит мафией!</h2>
        ) : (
          <h2 className="text-2xl">Никто не был убит этой ночью.</h2>
        )}
        <div className="mt-4 text-lg">Последнее слово</div>
        <div className="flex items-center justify-center space-x-4 mt-2">
          <div
            className="text-4xl font-mono cursor-pointer border border-gray-400 rounded-lg p-4"
            onClick={toggleTimer}
          >
            {time}
          </div>
          <Button
            className="bg-white text-gray-900 rounded-lg p-2 flex items-center justify-center hover:bg-gray-200"
            onClick={resetTimer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M22 20v-5h-5" />
            </svg>
          </Button>
        </div>
        <button 
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleContinue}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default ShotDisplay; 