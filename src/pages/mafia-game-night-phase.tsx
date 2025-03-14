'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from 'next/navigation'
import { useRoom } from '@/contexts/RoomContext'

export default function Component() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { roomId, setRoomId } = useRoom()
  const [killedPlayer, setKilledPlayer] = useState<number | null>(null)
  const [donCheck, setDonCheck] = useState<number | null>(null)
  const [sheriffCheck, setSheriffCheck] = useState<number | null>(null)

  useEffect(() => {
    const urlRoomId = searchParams?.get('roomId')
    if (urlRoomId && !roomId) {
      setRoomId(urlRoomId)
    }
  }, [searchParams, roomId, setRoomId])

  const handleKillClick = (num: number) => {
    setKilledPlayer(killedPlayer === num ? null : num)
  }

  const handleDonClick = (num: number) => {
    setDonCheck(donCheck === num ? null : num)
  }

  const handleSheriffClick = (num: number) => {
    setSheriffCheck(sheriffCheck === num ? null : num)
  }

  const handleDayTransition = () => {
    if (roomId) {
      router.push(`/mafia-game-day-phase?roomId=${roomId}`);
    }
  }

  // const handleKillAction = async (username: string) => {
  //   try {
  //     const response = await api.get('/check/boss/', {
  //       data: {
  //         username,
  //         room_id: roomId
  //       }
  //     })
  //     if (response.data.is_mafia_boss) {
  //       await api.put('/set/kill/', {
  //         username,
  //         room_id: roomId
  //       })
  //     }
  //     // setKilledPlayer(username)
  //   } catch (error) {
  //     console.error('Failed to perform kill action:', error)
  //   }
  // }

  // const handleSheriffCheck = async (playerId: number) => {
  //   try {
  //     await api.post('/check/sheriff/', {
  //       playerId
  //     })
  //     setSheriffCheck(playerId)
  //   } catch (error) {
  //     console.error('Failed to perform sheriff check:', error)
  //   }
  // }

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

        <div className="space-y-6">
          <div className="space-y-2">
            <Button 
              className="w-full bg-[#2a2535] hover:bg-[#2a2535]/80 text-white"
            >
              Убийство
            </Button>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({length: 10}, (_, i) => (
                <Button
                  key={i + 1}
                  variant="outline"
                  className={`${
                    killedPlayer === i + 1
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  } hover:bg-gray-600`}
                  onClick={() => handleKillClick(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full bg-[#2a2535] hover:bg-[#2a2535]/80 text-white"
            >
              Проверка Дона
            </Button>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({length: 10}, (_, i) => (
                <Button
                  key={i + 1}
                  variant="outline"
                  className={`${
                    donCheck === i + 1
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  } hover:bg-gray-600`}
                  onClick={() => handleDonClick(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            {donCheck && (
              <div className="text-center text-gray-300">
                {donCheck} игрок шериф
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full bg-red-900/80 hover:bg-red-900/60 text-white"
            >
              Проверка Шерифа
            </Button>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({length: 10}, (_, i) => (
                <Button
                  key={i + 1}
                  variant="outline"
                  className={`${
                    sheriffCheck === i + 1
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  } hover:bg-gray-600`}
                  onClick={() => handleSheriffClick(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            {sheriffCheck && (
              <div className="text-center text-red-200">
                {sheriffCheck} игрок не мафия
              </div>
            )}
          </div>

<div className="flex justify-center mt-8">
            <Button 
              variant="secondary"
              className="w-48 h-16 bg-pink-200 hover:bg-pink-300 text-gray-900 rounded-lg"
              onClick={handleDayTransition}
            >
              День
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}