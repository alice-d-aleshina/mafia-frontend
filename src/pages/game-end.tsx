import { MenuIcon, UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react';
import { useRoom } from '@/contexts/RoomContext'

export default function Component() {
  const router = useRouter();
  const { roomId } = useRoom();
  const [mafiaWin, setMafiaWin] = useState<boolean | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setMafiaWin(searchParams.get('winner') === 'mafia');
      setWinner(searchParams.get('winner'));
    }
  }, []);

  const handleGameEnd = () => {
    console.log("Current roomId:", roomId);
    if (roomId) {
      router.push(`/score-distribution?roomId=${roomId}`);
    } else {
      console.error("roomId is null or undefined");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        

        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-8">
          <div className={`${mafiaWin === true ? 'bg-red-900/90' : 'bg-blue-900/90'} text-white text-xl font-medium px-8 py-4 rounded-lg`}>
            {mafiaWin === true ? 'Победила команда черных (мафия)!' : mafiaWin === false ? 'Победила команда красных (мирные жители)!' : 'Загрузка...'}
          </div>
         
         
         
          <Button
            className="w-full h-16 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
            onClick={handleGameEnd}
          > 
            Перейти к распределению баллов
          </Button>
        </div>
      </div>
    </div>
  );
}