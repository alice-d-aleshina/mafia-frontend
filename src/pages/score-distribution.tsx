import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';

interface Player {
  id: number;
  username: string;
  place: number;
}

const ScoreDistribution = () => {
  const router = useRouter();
 // const { roomId } = router.query; // Извлечение roomId из строки поиска
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<{ [key: number]: number }>({});
  const {roomId, playerNicknames } = useRoom();

  useEffect(() => {
    if (roomId) {
      console.log("Room ID:", roomId); // Проверка, что roomId не null
    } else {
      console.error("Room ID is null or undefined");
    }
  }, [roomId]);

  useEffect(() => {
    console.log("Player Nicknames:", playerNicknames);
  }, [playerNicknames]);

  
  const handleScoreChange = (id: number, value: number) => {
    setScores(prevScores => ({
      ...prevScores,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Распределение баллов:', scores);
    // Здесь можно добавить логику для обработки выставленных баллов
    // Перенаправление на главное меню
    router.push('/mafia-menu'); // Перенаправление на экран меню
  };

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <h1 className="text-lg mb-4">Распределение баллов</h1>
        <div className="space-y-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Player ID</th>
                <th className="px-4 py-2">Nickname</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {playerNicknames && playerNicknames.length > 0 ? (
                playerNicknames.map(player => (
                  <tr key={player.id}>
                    <td className="border px-4 py-2">{player.id}</td>
                    <td className="border px-4 py-2">{player.nickname}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={scores[player.id] !== undefined ? scores[player.id] : ''}
                        onChange={(e) => handleScoreChange(player.id, Number(e.target.value))}
                        className="w-16 bg-transparent border-0 placeholder:text-white/60 text-white"
                        placeholder="Баллы"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border px-4 py-2 text-center">Нет игроков</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Button
          onClick={handleSubmit}
          className="mt-4 w-full bg-green-600 hover:bg-green-700"
        >
          Подтвердить
        </Button>
      </div>
    </div>
  );
};

export default ScoreDistribution; 