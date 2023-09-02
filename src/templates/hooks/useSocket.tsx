import { useEffect, useRef } from 'react'
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'

export const useSocket = (
  uri: string,
  opts?: Partial<ManagerOptions & SocketOptions>
): Socket => {
  const { current: socket } = useRef(io(uri, opts))

  useEffect(() => {
    // ON UNMOUNT (If webpage is closed)
    return () => {
      if (socket) socket.close()
    }
  }, [socket])

  return socket
}
