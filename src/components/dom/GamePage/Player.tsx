import type { PlayerSummary } from '@/protocol/types'

interface PlayerProps extends PlayerSummary {
  active?: boolean
  align?: 'left' | 'right'
}

export const Player = ({ name, active = false, score, isSelf, connected = true, align = 'left' }: PlayerProps) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 shadow-lg ${
        active ? 'border-amber-300 bg-amber-100 text-slate-950' : 'border-slate-300 bg-white/90 text-slate-950'
      } ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
          active ? 'bg-amber-400 text-slate-950' : 'bg-purple-600 text-white'
        }`}
      >
        {name[0]?.toUpperCase() ?? '?'}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='truncate text-sm font-bold'>
          {name}
          {isSelf ? ' (you)' : ''}
        </div>
        <div className='flex items-center gap-2 text-xs font-semibold text-slate-600'>
          <span>Score {score}</span>
          {!connected ? <span>Offline</span> : null}
          {active ? <span className='text-amber-700'>Turn</span> : null}
        </div>
      </div>
    </div>
  )
}
