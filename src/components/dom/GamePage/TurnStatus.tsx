import useStore from '@/store/store'

export function TurnStatus() {
  const playerId = useStore((state) => state.playerId)
  const turnMode = useStore((state) => state.turnMode)
  const currentTurnPlayerId = useStore((state) => state.currentTurnPlayerId)
  const currentTurnPlayerName = useStore((state) => state.currentTurnPlayerName)

  const label =
    turnMode === 'strict-turns'
      ? !currentTurnPlayerId
        ? 'Assigning first turn...'
        : currentTurnPlayerId === playerId
          ? 'Your turn'
          : `${currentTurnPlayerName ?? 'Next player'}'s turn`
      : 'Free-for-all mode'

  const hint =
    turnMode === 'strict-turns'
      ? currentTurnPlayerId === playerId
        ? 'Enter a valid city to pass the turn'
        : 'Waiting for the current player'
      : 'Anyone can submit a valid city'

  return (
    <div className='pointer-events-auto flex flex-col items-center gap-1 rounded-lg border border-slate-300 bg-white/95 px-4 py-2 text-slate-950 shadow-lg'>
      <div className='text-sm font-bold'>{label}</div>
      <div className='text-xs font-semibold text-slate-500'>{hint}</div>
    </div>
  )
}
