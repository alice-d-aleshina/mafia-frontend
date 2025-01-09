'use client' 
 
import { useState } from 'react' 
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input" 
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
} from "@/components/ui/select" 
import { useRouter } from 'next/navigation'
import api from '@/utils/api';
import { useRoom } from '@/contexts/RoomContext';
import axios from 'axios';

type Player = { 
  id: number 
  nickname: string 
  number: string | null 
} 
 
interface RoomResponse {
  post: {
    id: number;
    room_id: string;
  }
}

interface PlayerResponse {
  post: {
    id: number;
    username: string;
    role: string;
    room_id: string;
    active: boolean;
    place: number;
  }
}

export default function Component() { 
  const router = useRouter()
  const { roomId, setRoomId } = useRoom();
  
  const [players, setPlayers] = useState<Player[]>( 
    Array.from({ length: 10 }, (_, i) => ({ 
      id: i + 1, 
      nickname: '', 
      number: null 
    })) 
  ) 
 
  const [usedNumbers, setUsedNumbers] = useState<Set<string>>(new Set()) 
 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const handleNicknameChange = (id: number, value: string) => { 
    setPlayers(players.map(player =>  
      player.id === id ? { ...player, nickname: value } : player 
    )) 
  } 
 
  const handleNumberSelect = (id: number, value: string) => { 
    const player = players.find(p => p.id === id) 
    if (player?.number) { 
      setUsedNumbers(prev => { 
        const next = new Set(prev) 
        next.delete(player.number!) 
        next.add(value) 
        return next 
      }) 
    } else { 
      setUsedNumbers(prev => new Set([...prev, value])) 
    } 
     
    setPlayers(players.map(player =>  
      player.id === id ? { ...player, number: value } : player 
    )) 
  } 
 
  const activePlayerCount = players.filter(p => p.nickname).length 
 
  const handleStartGame = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Initialize the game state for this room
      const initialGameState = {
        mafiaSelected: [],
        donSelected: null,
        sheriffSelected: null,
        eliminatedPlayers: [],
        shootPlayer: null,
        playerFouls: {},
        mafiaPlayers: []
      };

      // Save initial state to session storage
      sessionStorage.setItem(`gameState_${roomCode}`, JSON.stringify(initialGameState));
      
      setRoomId(roomCode);
      router.push(`/mafia-game-first-night?roomId=${roomCode}`);
    } catch (error) {
      console.error('Error details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        setError(`Ошибка при создании игры: ${error.response?.data?.detail || 'Неизвестная ошибка'}`);
      } else {
        setError('Неизвестная ошибка при создании игры');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGame = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      const roomResponse = await api.post<RoomResponse>('/create/room/', {
        room_id: roomCode
      });

      if (roomResponse.data.post) {
        const activePlayers = players.filter(p => p.nickname && p.number);
        
        // Создаем игроков с place
        for (const player of activePlayers) {
          await api.post<PlayerResponse>('/create/player/', {
            username: player.nickname,
            room_id: roomCode,
            role: 'civilian',
            password: '',
            place: player.number // Используем номер как place
          });
        }

        // Создаем админа
        await api.post<PlayerResponse>('/create/player/', {
          username: 'admin',
          room_id: roomCode,
          role: 'admin',
          password: 'admin_password',
          place: 0
        });

        setRoomId(roomCode);
        router.push(`/game-code?roomId=${roomCode}`);
      }
    } catch (error) {
      console.error('Failed to save game:', error);
      setError('Ошибка при сохранении игры. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  // Функция проверки валидности формы
  const isFormValid = () => {
    const activePlayers = players.filter(p => p.nickname.trim());
    // Проверяем, что все игроки с никнеймами имеют заполненные поля
    const allPlayersHaveNicknames = players.every(p => p.nickname.trim() !== '');
    
    return allPlayersHaveNicknames; // Теперь проверяем только наличие никнеймов
  };

  // Получаем текст подсказки о том, что не так
  const getValidationMessage = () => {
    const activePlayers = players.filter(p => p.nickname.trim());
    
    if (activePlayers.length < 10) {
      return 'Необходимо минимум 10 игрока';
    }
    return null;
  };

  return ( 
    <div className="flex min-h-screen bg-[#1a1625] text-white"> 
      <div className="w-full max-w-md mx-auto p-4"> 
        <div className="text-center mb-4 bg-pink-200/20 text-pink-200 py-2 rounded-lg"> 
          Введите ники игроков для распределения ролей 
        </div> 
 
        <div className="text-red-500 mb-4 px-4 py-2 bg-red-900/20 rounded-lg"> 
          Игроков: {activePlayerCount} из 10 
        </div> 

        {/* Добавляем сообщение валидации */}
        {getValidationMessage() && (
          <div className="text-yellow-500 mb-4 px-4 py-2 bg-yellow-900/20 rounded-lg">
            {getValidationMessage()}
          </div>
        )}
 
        <div className="space-y-2 mb-6"> 
          {players.map((player, index) => ( 
            <div key={player.id} className="flex items-center space-x-2 bg-red-900/90 rounded-lg p-2"> 
              <span className="text-white">{index + 1}</span>
              <Input 
                value={player.nickname} 
                onChange={(e) => handleNicknameChange(player.id, e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && index < players.length - 1) {
                    // Переход к следующему игроку
                    const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
                    if (nextInput) {
                      nextInput.focus();
                    }
                  }
                }}
                placeholder="Введите участника" 
                className="flex-1 bg-transparent border-none placeholder:text-white/50" 
                data-index={index} // Добавляем атрибут для идентификации индекса
              /> 
            </div> 
          ))} 
        </div> 
 
        <div className="space-y-2">
          <Button  
            variant="secondary" 
            className="w-full bg-pink-200 hover:bg-pink-300 text-gray-900 rounded-full py-6 mb-2"
            onClick={handleStartGame}
            disabled={!isFormValid() || isLoading}
          > 
            {!isFormValid() 
              ? 'Заполните все поля' 
              : isLoading 
                ? 'Загрузка...' 
                : 'Начать игру'
            }
          </Button> 

          <Button  
            variant="secondary" 
            className="w-full bg-red-900/90 hover:bg-red-900/70 text-white rounded-full py-6"
            onClick={handleSaveGame}
            disabled={!isFormValid() || isLoading}
          > 
            {!isFormValid() 
              ? 'Заполните все поля' 
              : isLoading 
                ? 'Сохранение...' 
                : 'Сохранить игру'
            }
          </Button>

          {error && (
            <div className="text-red-500 text-sm text-center mt-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}