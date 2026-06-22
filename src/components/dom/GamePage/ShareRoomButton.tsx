import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { Tooltip } from '@/components/ui/Tooltip'

interface ShareRoomButtonProps {
  roomId: string | null
}

export function ShareRoomButton({ roomId }: ShareRoomButtonProps) {
  if (!roomId) return null

  const copyRoomUrl = async () => {
    const roomUrl = window.location.href
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(roomUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = roomUrl
        textArea.setAttribute('readonly', 'true')
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.select()
        const copied = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (!copied) throw new Error('Clipboard copy unavailable')
      }
      toast.success('Room link copied')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to copy room link')
    }
  }

  return (
    <Tooltip content='Copy room invite link'>
      <button
        type='button'
        aria-label='Copy room invite link'
        className='pointer-events-auto flex h-12 w-12 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-950 shadow-xl hover:bg-slate-50'
        onClick={() => void copyRoomUrl()}
      >
        <ClipboardDocumentIcon className='h-5 w-5' />
      </button>
    </Tooltip>
  )
}
