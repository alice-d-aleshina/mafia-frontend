import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';

interface Player {
  id: number;
  username: string;
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
    router.push('/next-screen'); // Перенаправление на следующий экран
  };

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <h1 className="text-lg mb-4">Распределение баллов</h1>
        <div className="space-y-4">
          {players.map(player => (
            <div key={player.id} className="flex items-center justify-between">
              <span>{player.id}. {player.username}</span>
              <input
                type="number"
                value={scores[player.id] || 0}
                onChange={(e) => handleScoreChange(player.id, Number(e.target.value))}
                className="w-16 bg-red-900/90 border-0 placeholder:text-white/60 text-white"
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