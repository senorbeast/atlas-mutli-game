import { NextResponse } from 'next/server'

const BACKEND_HTTP_URL = process.env.ATLAS_BACKEND_HTTP_URL ?? 'http://localhost:8080'

interface BackendCreateRoomResponse {
  roomId?: string
}

export async function POST() {
  try {
    const response = await fetch(`${BACKEND_HTTP_URL.replace(/\/$/, '')}/create`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to create room' }, { status: response.status })
    }

    const data = (await response.json()) as BackendCreateRoomResponse
    if (!data.roomId) {
      return NextResponse.json({ error: 'Backend response did not include roomId' }, { status: 502 })
    }

    return NextResponse.json({ roomId: data.roomId })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to reach Atlas backend' },
      { status: 502 },
    )
  }
}
