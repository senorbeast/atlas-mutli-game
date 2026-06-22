import React from 'react'
import useZStore from '@/store/store'

const PrevWords = () => {
  const prevWords = useZStore((state) => state.wordsSubmitted)
    .filter((word) => word.toLowerCase() !== 'atlas')
    .slice(-3)
  if (prevWords.length === 0) return null

  return (
    <ul className='pointer-events-auto flex max-w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg'>
      {prevWords.map((word) => {
        return (
          <li key={word} className='max-w-28 truncate rounded bg-slate-100 px-2 py-1'>
            {word}
          </li>
        )
      })}
    </ul>
  )
}

export default PrevWords
