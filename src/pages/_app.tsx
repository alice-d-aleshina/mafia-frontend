import type { AppProps } from 'next/app'
import { RoomProvider } from '@/contexts/RoomContext'
import '../app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RoomProvider>
      <Component {...pageProps} />
    </RoomProvider>
  )
} 