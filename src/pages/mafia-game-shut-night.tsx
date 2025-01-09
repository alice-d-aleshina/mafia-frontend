'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useRoom } from '@/contexts/RoomContext'
import { checkGameEnd } from '@/utils/gameLogic'

export default function NightShootComponent() {
  const router = useRouter()
  const { roomId, eliminatedPlayers, setShootPlayer, shootPlayer, mafiaPlayers } = useRoom()
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleShootClick = (num: number) => {
    setSelectedPlayer(selectedPlayer === num ? null : num)
  }

  const handleConfirmShoot = () => {
    if (selectedPlayer) {
      setShootPlayer(selectedPlayer);
      console.log(`Shooting player: ${selectedPlayer}`);

      const { isGameOver, mafiaWin } = checkGameEnd(eliminatedPlayers, mafiaPlayers, shootPlayer);
      if (isGameOver) {
        router.push(`/game-end?winner=${mafiaWin ? 'mafia' : 'citizens'}`);
        return;
      }

      router.push(`/mafia-game-don-check-night?roomId=${roomId}`);
    } else {
      console.error('No player selected for shooting');
    }
  }

  const handleMissClick = () => {
    setShootPlayer(null);
    console.log('Missed the shot');
    router.push(`/mafia-game-don-check-night?roomId=${roomId}`);
  }

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <div></div>
          <div className="bg-[#2a2535] px-6 py-2 rounded-full">
            НОЧЬ
          </div>
          <div></div>
        </header>

        <h3 className="text-center text-lg font-bold mb-4">Выстрел мафии</h3>

        <div className="flex justify-center mb-4">
          <Button 
            variant="outline"
            className="w-48 h-14 bg-red-600 text-white flex items-center justify-center rounded"
            onClick={handleMissClick}
          >
            ✖ {/* Large cross icon */}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {[5, 6, 4, 7, 3, 8, 2, 9, 1, 10].map((num) => {
              const isEliminated = eliminatedPlayers.includes(num) || shootPlayer === num;
              return (
                <div className="flex justify-center" key={num}>
                  <Button
                    variant="outline"
                    className={`w-full h-12 text-lg font-medium relative ${
                      mounted && isEliminated 
                        ? 'bg-[#4A4458] text-[#A5A5A5] cursor-not-allowed' 
                        : selectedPlayer === num 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}
                    onClick={() => !isEliminated && handleShootClick(num)}
                    disabled={mounted ? isEliminated : false}
                  >
                    {num}
                  </Button>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center mt-8">
            <Button 
              variant="outline"
              className="w-48 h-16 bg-pink-200 hover:bg-pink-300 text-gray-900 rounded-lg"
              onClick={handleConfirmShoot}
            >
              К проверке Дона
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
