import React from 'react'
import useZStore from '@/store/store'

const PrevWords = () => {
  const prevWords = useZStore((state) => state.wordsSubmitted).slice(-5)
  return (
    <div className='flex card'>
      {prevWords.map((word) => {
        return <li key={word}>{word}</li>
      })}
    </div>
  )
}

export default PrevWords
