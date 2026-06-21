import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useChat } from '@/hooks/useChat'

const formatMessageTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

const Chat = () => {
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const { messages, playerId, unreadMessageCount, isChatOpen, setChatOpen, canSend, sendChat, getSenderName } =
    useChat()

  useEffect(() => {
    if (!isChatOpen) return
    messagesEndRef.current?.scrollIntoView({ block: 'end' })
  }, [isChatOpen, messages.length])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const didSend = sendChat(draft)
    if (!didSend) {
      toast.error(canSend ? 'Enter a message first' : 'Chat is still connecting')
      return
    }

    setDraft('')
  }

  return (
    <div className='pointer-events-auto w-80 max-w-[calc(100vw-1.5rem)]'>
      {isChatOpen ? (
        <div className='overflow-hidden rounded-lg border border-slate-300 bg-white text-slate-950 shadow-2xl'>
          <div className='flex h-12 items-center justify-between border-b border-slate-200 px-3'>
            <div className='flex items-center gap-2 font-bold'>
              <ChatBubbleLeftRightIcon className='h-5 w-5 text-cyan-600' />
              Chat
            </div>
            <button
              type='button'
              aria-label='Close chat'
              className='rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-950'
              onClick={() => setChatOpen(false)}
            >
              <XMarkIcon className='h-5 w-5' />
            </button>
          </div>

          <div className='flex h-80 flex-col gap-3 overflow-y-auto bg-slate-50 p-3'>
            {messages.length === 0 ? (
              <div className='flex h-full items-center justify-center text-sm font-semibold text-slate-500'>
                No messages yet
              </div>
            ) : null}
            {messages.map((item) => {
              const isSelf = item.senderId === playerId
              return (
                <div key={item.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[78%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                      isSelf ? 'bg-cyan-600 text-white' : 'bg-white text-slate-950'
                    }`}
                  >
                    <div
                      className={`mb-1 flex items-center justify-between gap-3 text-xs ${isSelf ? 'text-cyan-50' : 'text-slate-500'}`}
                    >
                      <span className='font-bold'>{getSenderName(item.senderId, item.senderName)}</span>
                      <span>{formatMessageTime(item.receivedAt)}</span>
                    </div>
                    <div className='break-words leading-5'>{item.content}</div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          <form className='flex items-center gap-2 border-t border-slate-200 bg-white p-2' onSubmit={handleSubmit}>
            <input
              value={draft}
              disabled={!canSend}
              maxLength={280}
              placeholder={canSend ? 'Message' : 'Connecting...'}
              className='min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-100'
              onChange={(event) => setDraft(event.target.value)}
            />
            <button
              type='submit'
              aria-label='Send message'
              disabled={!canSend}
              className='flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60'
            >
              <PaperAirplaneIcon className='h-5 w-5' />
            </button>
          </form>
        </div>
      ) : (
        <button
          type='button'
          className='relative flex h-12 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 shadow-xl hover:bg-slate-50'
          onClick={() => setChatOpen(true)}
        >
          <ChatBubbleLeftRightIcon className='h-5 w-5 text-cyan-600' />
          Chat
          {unreadMessageCount > 0 ? (
            <span className='absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white'>
              {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
            </span>
          ) : null}
        </button>
      )}
    </div>
  )
}

export default Chat
