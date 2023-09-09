import { continuationValidation, wordValidation } from '@/helpers/validations'
import useStoreImpl from '@/store/store'
import React, { useState } from 'react'

const GameInput = () => {
  const [userInput, setUserInput] = useState<string>('')
  const [contValid, setContValid] = useState<boolean>(false)
  const [wordValid, setWordValid] = useState<boolean>(false)

  const prevWord = useStoreImpl((state) => state.wordsSubmitted[state.wordsSubmitted.length - 1])
  const addToWordSubmitted = useStoreImpl((state) => state.addWord)

  return (
    <input
      placeholder='type here'
      className={`input ${contValid ? 'green-first-letter' : ''}`}
      value={userInput}
      onChange={(e) => {
        setUserInput(e.target.value)
        if (e.target.value[0] && continuationValidation(prevWord, e.target.value[0])) {
          //  Check First Validation based on GameMode
          setContValid(true)
          console.log('Succesfully First letter green')
        } else {
          setContValid(false)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          // Check Word Validation Based on GameMode
          setWordValid(wordValidation(userInput))
          if (contValid && wordValid) {
            addToWordSubmitted(userInput)
          }
        }
      }}
    ></input>
  )
}

export default GameInput
