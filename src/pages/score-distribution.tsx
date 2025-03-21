import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';

export default function ScoreDistribution() {
  const router = useRouter();
  const [redPoints, setRedPoints] = useState(0);
  const [blackPoints, setBlackPoints] = useState(0);
  const [winner, setWinner] = useState<'red' | 'black' | null>(null);

  const handleSubmit = () => {
    // Здесь можно добавить логику для обработки выставленных баллов
    console.log('Баллы красных:', redPoints);
    console.log('Баллы черных:', blackPoints);
    // Например, отправить данные на сервер или сохранить в локальном хранилище
    router.push('/next-screen'); // Перенаправление на следующий экран
  };

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <h1 className="text-lg mb-4">Распределение баллов</h1>
        <div className="mb-4">
          <h2 className="text-md">Выберите победителя:</h2>
          <Button onClick={() => setWinner('red')} className="mr-2">Красные</Button>
          <Button onClick={() => setWinner('black')}>Черные</Button>
        </div>
        {winner && (
          <div>
            <h2 className="text-md mb-2">Баллы для {winner === 'red' ? 'красных' : 'черных'}:</h2>
            <input
              type="number"
              value={winner === 'red' ? redPoints : blackPoints}
              onChange={(e) => {
                if (winner === 'red') {
                  setRedPoints(Number(e.target.value));
                } else {
                  setBlackPoints(Number(e.target.value));
                }
              }}
              className="w-full bg-red-900/90 border-0 placeholder:text-white/60 text-white mb-4"
              placeholder="Введите баллы"
            />
          </div>
        )}
        <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
          Подтвердить
        </Button>
      </div>
    </div>
  );
} 