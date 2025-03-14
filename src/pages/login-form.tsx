import { MenuIcon, UserCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authService } from './api/utils/api'
import axios from 'axios'

export default function Component() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async () => {
    setError(null)
    setIsLoading(true)

    try {
      console.log('Sending login request...')
      const response = await authService.login(formData.username, formData.password)
      
      console.log('Login response:', response)
      
      if (response.data.post) {
        localStorage.setItem('username', response.data.post.username)
        localStorage.setItem('userId', response.data.post.id)
        localStorage.setItem('role', response.data.post.role)
        localStorage.setItem('token', response.data.post.access_token)
        
        router.push('/mafia-create-game')
      }
    } catch (error) {
      console.error('Login error details:', error)
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          setError('Ошибка соединения. Проверьте консоль разработчика.')
        } else if (error.response?.status === 400) {
          setError(error.response.data.error || 'Неверное имя пользователя или пароль')
        } else {
          setError(`Ошибка: ${error.message}`)
        }
      } else {
        setError('Неизвестная ошибка')
      }
    } finally {
      setIsLoading(false)
    }
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
          <div className="w-full max-w-xs space-y-4">
            <div className="space-y-1">
              <div className="text-sm">Имя</div>
              <Input 
                type="text"
                name="username"
                placeholder="Введите ник"
                className="w-full bg-red-900/90 border-0 placeholder:text-white/60 text-white"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-1">
              <div className="text-sm">Пароль</div>
              <Input 
                type="password"
                name="password"
                placeholder="Введите пароль"
                className="w-full bg-red-900/90 border-0 placeholder:text-white/60 text-white"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm mt-2">
                {error}
              </div>
            )}
          </div>
          
          <Button 
            className="w-full max-w-xs bg-red-900/90 hover:bg-red-900/70 text-white rounded-full py-6 mt-8"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </Button>
        </div>
      </div>
    </div>
  )
}