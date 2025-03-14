'use client'

import { useEffect, useState } from 'react'
import { MenuIcon, UserCircle, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useRoom } from '@/contexts/RoomContext';

export default function Component() {
  const router = useRouter()
  const { setRoomId } = useRoom();
  const [gameCode, setGameCode] = useState('')

  useEffect(() => {
    // Generate random 4 digit number
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setGameCode(code)
  }, [])

  useEffect(() => {
    const createRoom = async () => {
      // try {
      //   const response = await api.post('/create/room/', {
      //     room_id: gameCode
      //   });
      //   setRoomId(gameCode);
      // } catch (error) {
      //   console.error('Failed to create room:', error);
      // }
    };
    
    if (gameCode) {
      createRoom();
    }
  }, [gameCode, setRoomId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameCode)
  }

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <MenuIcon className="w-6 h-6" />
          <div className="text-lg">Mafia</div>
          <UserCircle className="w-6 h-6" />
        </header>

        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-4">
          <div className="w-full max-w-xs bg-pink-200/90 text-gray-900 rounded-lg p-4 text-center space-y-1 relative">
            <div className="text-sm">Код вашей игры</div>
            <div className="text-lg font-medium">{gameCode}</div>
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-pink-300/50 rounded-full"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          
          <Button 
            className="w-full max-w-xs bg-red-900/90 hover:bg-red-900/70 text-white rounded-full py-6"
            onClick={() => router.push('/mafia-create-game')}
          >
            Готово
          </Button>
        </div>
      </div>
    </div>
  )
}