"use client" 

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useRoom } from '@/contexts/RoomContext';

export default function Component() { 
  const router = useRouter()
  const searchParams = useSearchParams()
  const { 
    roomId, 
    setRoomId, 
    mafiaSelected, 
    setMafiaSelected, 
    donSelected, 
    setDonSelected, 
    sheriffSelected, 
    setSheriffSelected,
    setMafiaPlayers
  } = useRoom()

  useEffect(() => {
    const urlRoomId = searchParams?.get('roomId')
    if (urlRoomId && !roomId) {
      setRoomId(urlRoomId)
    }
  }, [searchParams, roomId, setRoomId])

  useEffect(() => {
    console.log('Current roomId:', roomId)
  }, [roomId])

  const handleMafiaClick = (num: number) => {
    if (donSelected === num || sheriffSelected === num) {
      return;
    }
    const newMafiaSelected = mafiaSelected.includes(num)
      ? mafiaSelected.filter((n: number) => n !== num)
      : mafiaSelected.length < 2 
        ? [...mafiaSelected, num]
        : mafiaSelected;
    
    setMafiaSelected(newMafiaSelected);
  }

  const handleDonClick = (num: number) => {
    if (mafiaSelected.includes(num) || sheriffSelected === num) {
      return;
    }

    if (donSelected === num) {
      setDonSelected(null);
    } else {
      setDonSelected(num);
    }
  }

  const handleSheriffClick = (num: number) => {
    if (mafiaSelected.includes(num) || donSelected === num) {
      return;
    }

    if (sheriffSelected === num) {
      setSheriffSelected(null);
    } else {
      setSheriffSelected(num);
    }
  }

  const handleDayTransition = () => {
    if (!roomId) {
      console.error('Room ID is missing')
      return
    }

    const allMafiaPlayers = donSelected 
      ? [...mafiaSelected, donSelected]
      : mafiaSelected;
    
    setMafiaPlayers(allMafiaPlayers);
    
    console.log('Mafia team:', allMafiaPlayers);

    router.push(`/mafia-game-day-phase?roomId=${roomId}`)
  }

  const isRolesValid = () => {
    return mafiaSelected.length === 2 && donSelected !== null && sheriffSelected !== null;
  }
  
  return ( 
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col gap-4 items-center justify-center"> 
      <div className="w-full max-w-sm space-y-4 mb-6"> 
        <h1 className="text-2xl font-bold text-white text-center">Распределение Ролей</h1> 
        <h2 className="text-xl font-semibold text-gray-300 text-center">Знакомство</h2> 
      </div> 
      <div className="w-full max-w-sm space-y-4"> 
        <div className="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-3 text-center"> 
          <span className="text-purple-300 text-lg font-medium">Мафия</span> 
        </div> 
         
        <div className="grid grid-cols-5 gap-2">
          {Array.from({length: 10}, (_, i) => (
            <Button
              key={i + 1}
              variant="outline"
              className={`${
                mafiaSelected.includes(i + 1)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              } hover:bg-gray-600`}
              onClick={() => handleMafiaClick(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-3 text-center"> 
          <span className="text-gray-300 text-lg font-medium">Дон</span> 
        </div> 
 
        <div className="grid grid-cols-5 gap-2">
          {Array.from({length: 10}, (_, i) => (
            <Button
              key={i + 1}
              variant="outline"
              className={`${
                donSelected === i + 1
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-gray-300'
              } hover:bg-gray-600`}
              onClick={() => handleDonClick(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
 
        <div className="bg-red-900 rounded-lg p-3 text-center"> 
          <span className="text-red-300 text-lg font-medium">Шериф</span> 
        </div> 
 
        <div className="grid grid-cols-5 gap-2">
          {Array.from({length: 10}, (_, i) => (
            <Button
              key={i + 1}
              variant="outline"
              className={`${
                sheriffSelected === i + 1
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              } hover:bg-gray-600`}
              onClick={() => handleSheriffClick(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div> 
      
      <div className="w-full max-w-sm mt-4">
        <Button 
          className={`w-full ${
            isRolesValid() 
              ? 'bg-pink-200 hover:bg-pink-300' 
              : 'bg-gray-400 cursor-not-allowed'
          } text-gray-900 rounded-full py-6`}
          onClick={handleDayTransition}
          disabled={!isRolesValid()}
        >
          День
        </Button>
      </div>
    </div> 
  ) 
}