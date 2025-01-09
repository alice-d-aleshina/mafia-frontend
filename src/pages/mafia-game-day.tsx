import React from 'react';
import { useRouter } from 'next/navigation';

const DayScreen = () => {
  const router = useRouter();


  const handleClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const roomId = searchParams.get('roomId');
  

    router.push(`/mafia-game-day-phase?roomId=${roomId}`); // Переход на дневную фазу с передачей roomId
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100 text-gray-900 cursor-pointer"
      onClick={handleClick}
    >
      <h1 className="text-6xl font-bold">День</h1>
    </div>
  );
};

export default DayScreen;
