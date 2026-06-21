import React from 'react'
import useZStore from '@/store/store'

const PrevWords = () => {
  const prevWords = useZStore((state) => state.wordsSubmitted).slice(-5)
  return (
    <ul className='card pointer-events-auto flex max-w-[min(32rem,calc(100vw-2rem))] items-center gap-2 overflow-x-auto px-3 py-2 text-sm font-semibold shadow-lg'>
      {prevWords.map((word) => {
        return (
          <li key={word} className='whitespace-nowrap rounded bg-slate-100 px-2 py-1 text-slate-700'>
            {word}
          </li>
        )
      })}
    </ul>
  )
}

export default PrevWords
