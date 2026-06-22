import { NextRequest, NextResponse } from 'next/server'

const BACKEND_HTTP_URL = process.env.ATLAS_BACKEND_HTTP_URL ?? 'http://localhost:8080'

interface RouteContext {
  params: Promise<{ roomId: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { roomId } = await context.params
  const params = request.nextUrl.searchParams
  const backendUrl = new URL(`${BACKEND_HTTP_URL.replace(/\/$/, '')}/rooms/${roomId}/chat`)
  const limit = params.get('limit')
  const before = params.get('before')
  if (limit) backendUrl.searchParams.set('limit', limit)
  if (before) backendUrl.searchParams.set('before', before)

  try {
    const response = await fetch(backendUrl, { cache: 'no-store' })
    const body = await response.text()

    return new NextResponse(body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load chat history' },
      { status: 502 },
    )
  }
}
