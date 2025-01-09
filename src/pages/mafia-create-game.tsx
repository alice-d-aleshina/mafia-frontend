import { MenuIcon, UserCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/router'

export default function Component() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <MenuIcon className="w-6 h-6" />
          <div className="text-lg">Mafia</div>
          <UserCircle className="w-6 h-6" />
        </header>

        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-4">
          <Button 
            variant="secondary"
            className="w-full max-w-xs bg-pink-200 hover:bg-pink-300 text-gray-900 rounded-full py-6"
            onClick={() => router.push('/player-setup')}
          >
            Создать новую игру
          </Button>
          
          <Button 
            variant="secondary"
            className="w-full max-w-xs bg-pink-200 hover:bg-pink-300 text-gray-900 rounded-full py-6"
            onClick={() => router.push('/join-game')}
          >
            Войти в существующую сессию
          </Button>
        </div>
      </div>
    </div>
  )
}