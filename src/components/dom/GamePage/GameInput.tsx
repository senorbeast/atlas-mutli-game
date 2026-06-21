import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAtlasWordGame } from '@/hooks/useAtlasWordGame'

const submissionMessages = {
  empty: 'Enter a city name',
  'city-data': 'City data is still loading',
  'unknown-city': 'That city is not in the Atlas city list',
  continuation: 'City must start with the previous city ending letter',
}

const GameInput = () => {
  const [userInput, setUserInput] = useState('')
  const [continuationValid, setContinuationValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { submitWord, validateWord, previousWord, cityDataReady } = useAtlasWordGame()

  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    const result = await submitWord(userInput)
    setIsSubmitting(false)

    if (!result.ok) {
      toast.error(submissionMessages[result.reason])
      inputRef.current?.focus()
      return
    }

    toast.success(`${result.city.name}, ${result.city.country} accepted`)
    setUserInput('')
    setContinuationValid(false)
  }

  return (
    <div className='pointer-events-auto flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-2'>
      <input
        ref={inputRef}
        placeholder={
          cityDataReady ? `City starting with "${previousWord.at(-1)?.toUpperCase() ?? ''}"` : 'Loading cities...'
        }
        className={`input w-full rounded-lg ${continuationValid ? 'text-cyan-700' : ''}`}
        value={userInput}
        disabled={isSubmitting}
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
