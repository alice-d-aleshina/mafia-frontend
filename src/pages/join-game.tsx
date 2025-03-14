import { MenuIcon, UserCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { useRoom } from '@/contexts/RoomContext';

export default function Component() {
  const router = useRouter()
  const { setRoomId } = useRoom();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoinGame = async () => {
    // try {
    //   await api.post('/create/player/', {
    //     username: playerName,
    //     room_id: gameCode,
    //     role: 'civilian'
    //   });
    //   setRoomId(gameCode);
    //   router.push('/mafia-game-night-phase');
    // } catch (error) {
    //   console.error('Failed to join game:', error);
    // }
  };

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <MenuIcon className="w-6 h-6" />
          <div className="text-lg">Mafia</div>
          <UserCircle className="w-6 h-6" />
        </header>

        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-4">
          <Input 
            placeholder="Введите код игры"
            className="w-full max-w-xs bg-red-900/90 border-0 placeholder:text-white/60 text-white"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
          />
          
          <Button 
            variant="secondary"
            className="w-full max-w-xs bg-pink-200 hover:bg-pink-300 text-gray-900 rounded-full py-6"
            onClick={handleJoinGame}
          >
            Начать игру
          </Button>
        </div>
      </div>
    </div>
  )
}