import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAtlasWordGame } from '@/hooks/useAtlasWordGame'

const submissionMessages = {
  empty: 'Enter a city name',
  'city-data': 'City data is still loading',
  'unknown-city': 'That city is not in the Atlas city list',
  continuation: 'City must start with the previous city ending letter',
  duplicate: 'That city has already been used',
  'not-connected': 'Join a room before submitting cities',
  'assigning-turn': 'Assigning the first turn',
  'not-your-turn': 'Wait for your turn',
}

const GameInput = () => {
  const [userInput, setUserInput] = useState('')
  const [continuationValid, setContinuationValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const {
    submitWord,
    validateWord,
    previousWord,
    cityDataReady,
    isAssigningTurn,
    isCurrentPlayerTurn,
    currentTurnPlayerName,
    currentTurnPlayerId,
    acceptedCities,
    serverError,
    serverErrorId,
  } = useAtlasWordGame()
  const pendingAcceptedCount = useRef<number | null>(null)
  const pendingTurnPlayerId = useRef<string | null>(null)
  const pendingServerErrorId = useRef(0)

  useEffect(() => {
    if (!isSubmitting) return
    const acceptedChanged =
      pendingAcceptedCount.current !== null && acceptedCities.length !== pendingAcceptedCount.current
    const turnChanged = pendingTurnPlayerId.current !== null && currentTurnPlayerId !== pendingTurnPlayerId.current
    const hasNewServerError = Boolean(serverError && serverError.id !== pendingServerErrorId.current)
    if (acceptedChanged || turnChanged || hasNewServerError) {
      pendingAcceptedCount.current = null
      pendingTurnPlayerId.current = null
      setIsSubmitting(false)
    }
  }, [acceptedCities.length, currentTurnPlayerId, isSubmitting, serverError, serverErrorId])

  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    pendingAcceptedCount.current = acceptedCities.length
    pendingTurnPlayerId.current = currentTurnPlayerId
    pendingServerErrorId.current = serverErrorId
    const result = await submitWord(userInput)

    if (!result.ok) {
      pendingAcceptedCount.current = null
      pendingTurnPlayerId.current = null
      setIsSubmitting(false)
      toast.error(submissionMessages[result.reason])
      inputRef.current?.focus()
      return
    }

    toast.success(`${result.city.name}, ${result.city.country} submitted`)
    setUserInput('')
    setContinuationValid(false)
  }

  return (
    <div className='pointer-events-auto flex w-full flex-col gap-2'>
      <input
        ref={inputRef}
        placeholder={
          isAssigningTurn
            ? 'Assigning first turn...'
            : !isCurrentPlayerTurn && currentTurnPlayerName
              ? `${currentTurnPlayerName}'s turn`
              : cityDataReady
                ? `City starting with "${previousWord.at(-1)?.toUpperCase() ?? ''}"`
                : 'Loading cities...'
        }
        className={`input w-full rounded-lg ${continuationValid ? 'text-cyan-700' : ''}`}
        value={userInput}
        disabled={isSubmitting || isAssigningTurn || !isCurrentPlayerTurn}
        onChange={(event) => {
          setUserInput(event.target.value)
          setContinuationValid(validateWord(event.target.value).continuationValid)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            void handleSubmit()
          }
        }}
      />
    </div>
  )
}

export default GameInput
