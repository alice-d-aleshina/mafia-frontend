export const checkGameEnd = (
  eliminatedPlayers: number[],
  mafiaPlayers: number[],
  shootPlayer: number | null
): { isGameOver: boolean; mafiaWin: boolean } => {
  // Include shootPlayer in eliminated players if it's not null
  const allEliminatedPlayers = shootPlayer !== null ? [...eliminatedPlayers, shootPlayer] : eliminatedPlayers;

  // Get alive mafia count
  const aliveMafia = mafiaPlayers.filter(player => !allEliminatedPlayers.includes(player)).length;
  
  // Get total alive players
  const totalAlive = 10 - allEliminatedPlayers.length;
  const aliveNonMafia = totalAlive - aliveMafia;

  // Check win conditions
  if (aliveMafia === 0) {
    return { isGameOver: true, mafiaWin: false }; // Red team wins
  }
  
  if (aliveMafia >= aliveNonMafia) {
    return { isGameOver: true, mafiaWin: true }; // Black team wins
  }

  return { isGameOver: false, mafiaWin: false };
}; 