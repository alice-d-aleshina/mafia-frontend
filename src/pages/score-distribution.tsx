import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';

interface Player {
  id: number;
  username: string;
  place: number;
}

export default function ScoreDistribution() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (router.query.players) {
      const playersData: Player[] = JSON.parse(decodeURIComponent(router.query.players as string));
      setPlayers(playersData);
    }
  }, [router.query.players]);

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
          {players.map(player => (
            <div key={player.id} className="flex items-center justify-between bg-red-900/90 p-2 rounded-lg">
              <span>{player.place}. {player.username}</span>
              <input
                type="number"
                min={1}
                max={5}
                value={scores[player.id] || 0}
                onChange={(e) => handleScoreChange(player.id, Number(e.target.value))}
                className="w-16 bg-red-800 border-0 placeholder:text-white/60 text-white"
                placeholder="Баллы"
              />
            </div>
          ))}
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
} 