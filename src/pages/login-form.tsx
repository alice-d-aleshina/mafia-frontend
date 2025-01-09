import { MenuIcon, UserCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'

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
          <div className="w-full max-w-xs space-y-4">
            <div className="space-y-1">
              <div className="text-sm">Имя</div>
              <Input 
                type="text"
                placeholder="Введите ник"
                className="w-full bg-red-900/90 border-0 placeholder:text-white/60 text-white"
              />
            </div>

            <div className="space-y-1">
              <div className="text-sm">Пароль</div>
              <Input 
                type="password"
                placeholder="Введите пароль"
                className="w-full bg-red-900/90 border-0 placeholder:text-white/60 text-white"
              />
            </div>
          </div>
          
          <Button 
            className="w-full max-w-xs bg-red-900/90 hover:bg-red-900/70 text-white rounded-full py-6 mt-8"
            onClick={() => router.push('/mafia-create-game')}
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  )
}