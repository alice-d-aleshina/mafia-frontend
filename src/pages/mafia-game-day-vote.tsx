import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useRouter } from 'next/navigation'
import { useRoom } from '@/contexts/RoomContext'
import { checkGameEnd } from '@/utils/gameLogic'

export default function VotingScreen() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<number[]>([])
  const [roomId, setRoomId] = useState<string | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [selectedVoteCount, setSelectedVoteCount] = useState<number | null>(null)
  const [voteCount, setVoteCount] = useState<{ [key: number]: number }>({})
  const [isVotingComplete, setIsVotingComplete] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const candidateRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { roomId: contextRoomId, eliminatedPlayers, setEliminatedPlayers, shootPlayer, mafiaPlayers } = useRoom()

  useEffect(() => {
    // Parse candidates and roomId from URL
    const searchParams = new URLSearchParams(window.location.search)
    const candidatesParam = searchParams.get('candidates')
    const roomIdParam = searchParams.get('roomId')
    const parsedCandidates = candidatesParam ? candidatesParam.split(',').map(Number) : []
    
    setCandidates(parsedCandidates)
    setRoomId(roomIdParam)
    setSelectedCandidate(parsedCandidates[0] || null) // Set the first candidate as selected
  }, [])

  useEffect(() => {
    setSelectedVoteCount(null)
  }, [selectedCandidate])

  useEffect(() => {
    const currentCandidateIndex = candidates.indexOf(selectedCandidate!);
    const currentCandidateRef = candidateRefs.current[currentCandidateIndex];
    if (currentCandidateRef) {
      currentCandidateRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCandidate])

  const handleVote = () => {
    if (selectedVoteCount !== null && selectedCandidate !== null) {
        // Update the vote count for the selected candidate
        setVoteCount(prev => {
            const currentVoteCount = prev[selectedCandidate] || 0;
            const newVoteCount = {
                ...prev,
                [selectedCandidate]: currentVoteCount + selectedVoteCount
            };

            // Log the new vote count
            console.log('Updated Vote Count:', newVoteCount);

            // Check if voting is complete
            if (Object.keys(newVoteCount).length === candidates.length) {
                setIsVotingComplete(true);
                handleVoteEnd(newVoteCount); // Pass the updated vote count
            }

            return newVoteCount;
        });

        // Move to the next candidate
        const currentIndex = candidates.indexOf(selectedCandidate);
        const nextIndex = (currentIndex + 1) % candidates.length;
        setSelectedCandidate(candidates[nextIndex]);
    }
  }

  const getEliminatedPlayer = () => {
    const maxVotes = Math.max(...Object.values(voteCount));
    const eliminatedPlayer = Object.keys(voteCount).find(key => voteCount[+key] === maxVotes);
    return eliminatedPlayer ? `Выбывает игрок ${eliminatedPlayer} с ${maxVotes} голосами` : '';
  }

  const handleConfirm = () => {
    setIsVotingComplete(false);
    setVoteCount({});
    router.push(`/mafia-game-night?roomId=${roomId}`);
  }

  const handleVoteEnd = (updatedVoteCount: { [key: number]: number }) => {
    const maxVotes = Math.max(...Object.values(updatedVoteCount));
    const currentEliminatedPlayers = Object.keys(updatedVoteCount).filter(key => updatedVoteCount[+key] === maxVotes);
    
    // Создаем новый массив с убитыми игроками
    const newEliminatedPlayers = currentEliminatedPlayers.map(Number);

    if (newEliminatedPlayers.length === 1) {
      const newEliminatedPlayer = Number(newEliminatedPlayers[0]);
      if (shootPlayer !== null)
        setEliminatedPlayers([...eliminatedPlayers, shootPlayer, newEliminatedPlayer]);
      else 
        setEliminatedPlayers([...eliminatedPlayers, newEliminatedPlayer]);
      setShowButtons(false);

      // Check game end conditions after updating eliminatedPlayers
      const { isGameOver, mafiaWin } = checkGameEnd(eliminatedPlayers, mafiaPlayers, shootPlayer);
      if (isGameOver) {
        router.push(`/game-end?winner=${mafiaWin ? 'mafia' : 'citizens'}`);
        return;
      }

      // Continue with normal game flow
      router.push(`/mafia-game-night?roomId=${roomId}`);

    } else if (newEliminatedPlayers.length > 1) {
      setShowButtons(true);
      setCandidates(newEliminatedPlayers); // Обновляем кандидатов
      setIsVotingComplete(false);
    }

    console.log('Vote Count:', newEliminatedPlayers);
    console.log('Max Votes:', maxVotes);
  }

  const handlePopil = () => {
    router.push(`/mafia-game-day-discussion-phase?roomId=${roomId}&candidates=${candidates.join(',')}`);
  }

  const handleEndVoting = () => {
    // Никто не умирает
    // if (selectedCandidate) {
    //   setEliminatedPlayers([...eliminatedPlayers, selectedCandidate]);
    // }
    router.push(`/mafia-game-night?roomId=${roomId}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Голосование</h1>

        <div className="mb-6 overflow-x-auto">
          <Carousel className="flex">
            <CarouselContent>
              {candidates.map((candidate, index) => (
                <CarouselItem key={candidate} className="carousel-item basis-1/4 mb-4">
                  <div className="flex flex-col items-center">
                    <Button
                      ref={el => { candidateRefs.current[index] = el; }}
                      variant="outline"
                      className={`w-full h-16 text-xl font-medium border-2 ${
                        selectedCandidate === candidate ? 'bg-gray-200' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      {candidate}
                    </Button>
                    <div className="mt-2 text-sm">
                      Голосов: {voteCount[candidate] || 0}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          количество голосов
        </div>

        {isVotingComplete ? (
          <div className="text-center">
            <h2 className="text-xl font-bold">{getEliminatedPlayer()}</h2>
            <Button 
              className="mt-4 w-full py-2 text-lg font-medium bg-gray-800 hover:bg-gray-700 text-white"
              onClick={handleConfirm}
            >
              Подтвердить
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-3 flex justify-center">
              <Button
                key={0}
                variant="outline"
                className={`h-16 w-full text-xl font-medium border-2 ${
                  selectedVoteCount === 0 ? 'bg-gray-300' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedVoteCount(0)}
              >
                0
              </Button>
            </div>
            {[
              1, 2, 3, 
              4, 5, 6, 
              7, 8, 9
            ].map((num) => (
              <Button
                key={num}
                variant="outline"
                className={`h-16 w-full text-xl font-medium border-2 ${
                  selectedVoteCount === num ? 'bg-gray-300' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedVoteCount(num)}
              >
                {num}
              </Button>
            ))}
            <div className="col-span-3 flex justify-center">
              <Button
                key={10}
                variant="outline"
                className={`h-16 w-24 text-xl font-medium border-2 ${
                  selectedVoteCount === 10 ? 'bg-gray-300' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedVoteCount(10)}
              >
                10
              </Button>
            </div>
          </div>
        )}

        {!isVotingComplete && (
          <Button 
            className="w-full py-6 text-lg font-medium bg-gray-800 hover:bg-gray-700 text-white"
            onClick={handleVote}
            disabled={selectedVoteCount === null}
          >
            Голосовать
          </Button>
        )}

        {/* Render buttons if there are multiple eliminated players */}
        {showButtons && (
          <div className="flex space-x-4 mt-6">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
              onClick={handlePopil}
            >
              Попил
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-6"
              onClick={handleEndVoting}
            >
              Голосование не состоялось
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

