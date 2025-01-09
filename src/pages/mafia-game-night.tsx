import React from 'react';
import { useRouter } from 'next/navigation';

const NightScreen = () => {
  const router = useRouter();

  const handleClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const roomId = searchParams.get('roomId');
    router.push(`/mafia-game-shut-night?roomId=${roomId}`); // Переход на страницу "Shut Night" с передачей roomId
  };

  return (
    <div 
      className="flex items-center justify-center h-screen bg-gray-800 text-white cursor-pointer" 
      onClick={handleClick}
    >
      <h1 className="text-6xl font-bold">Ночь</h1>
    </div>
  );
};

export default NightScreen;
