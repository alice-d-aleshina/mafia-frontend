import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function DiscussionPhase() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<number[]>([])
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0)
  const [time, setTime] = useState('01:00')
  const [seconds, setSeconds] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)

  useEffect(() => {
    // This code runs only on the client side
    const searchParams = new URLSearchParams(window.location.search)
    const candidatesParam = searchParams.get('candidates')
    const roomIdParam = searchParams.get('roomId')
    const parsedCandidates = candidatesParam ? candidatesParam.split(',').map(Number) : []
    
    setCandidates(parsedCandidates)
    setRoomId(roomIdParam);
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds - 1

          if (newSeconds === 0) {
            setIsRunning(false)
            handleNextSpeaker()
          }

          const minutes = Math.floor(newSeconds / 60)
          const remainingSeconds = newSeconds % 60
          setTime(`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`)
          return newSeconds
        })
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isRunning, seconds])

  const handleNextSpeaker = () => {
    if (currentSpeakerIndex < candidates.length - 1) {
      setCurrentSpeakerIndex(prev => prev + 1)
      resetTimer()
    } else {
      router.push(`/mafia-game-day-vote?roomId=${roomId}&candidates=${candidates.join(',')}`);
    }
  }

  const resetTimer = () => {
    setSeconds(60)
    setTime('01:00')
    setIsRunning(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full max-w-md mx-auto p-4 bg-white shadow-lg relative">
        <header className="flex flex-col items-center justify-center mb-6">
          <div className="text-xl font-bold">ДЕНЬ</div>
          <div className="text-lg">Речь игрока {candidates[currentSpeakerIndex]}</div>
          <div className="text-sm text-gray-600">Порядок выступлений: {candidates.join(', ')}</div>
          <div className="flex items-center space-x-4">
            <div
              className="text-4xl font-mono cursor-pointer border border-gray-400 rounded-lg p-4"
              onClick={() => setIsRunning(prev => !prev)}
            >
              {time}
            </div>
            <Button
              className="bg-white text-gray-900 rounded-lg p-2 flex items-center justify-center hover:bg-gray-200"
              onClick={resetTimer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M22 20v-5h-5" />
              </svg>
            </Button>
          </div>
        </header>

        <Button
          className="w-full py-6 text-lg font-medium bg-gray-800 hover:bg-gray-700 text-white"
          onClick={handleNextSpeaker}
        >
          Конец Речи
        </Button>
      </div>
    </div>
  )
}

