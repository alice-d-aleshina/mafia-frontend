import '../app/globals.css';
import { MenuIcon, UserCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/router'
import ScoreDistribution from './score-distribution';

export default function Component() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen bg-[#1a1625] text-white">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] space-y-4">
          <Button 
            className="w-full max-w-xs bg-red-700 hover:bg-red-800 text-white rounded-full py-6"
            onClick={() => router.push('/login-form')}
          >
            Войти
          </Button>
          <Button 
            variant="secondary"
            className="w-full max-w-xs bg-pink-200 hover:bg-pink-300 text-gray-900 rounded-full py-6"
            onClick={() => router.push('/registration')}
          >
            Регистрация
          </Button>
        </div>
      </div>
    </div>
  )
}