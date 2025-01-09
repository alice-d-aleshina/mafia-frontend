import { MenuIcon, UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react';

export default function Component() {
  const router = useRouter();
  const [mafiaWin, setMafiaWin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if window is defined
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setMafiaWin(searchParams.get('winner') === 'mafia');
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <MenuIcon className="w-6 h-6" />
          <div className="text-lg">Mafia</div>
          <UserCircle className="w-6 h-6" />
        </header>

        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-8">
          <div className={`${mafiaWin === true ? 'bg-red-900/90' : 'bg-blue-900/90'} text-white text-xl font-medium px-8 py-4 rounded-lg`}>
            {mafiaWin === true ? 'Победила команда черных (мафия)!' : mafiaWin === false ? 'Победила команда красных (мирные жители)!' : 'Загрузка...'}
          </div>
          
          <Button
            className="w-48 h-16 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
            onClick={() => router.push('/mafia-create-game')}
          >
            В главное меню
          </Button>
        </div>
      </div>
    </div>
  );
}