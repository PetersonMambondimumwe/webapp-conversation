import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY } from '@/config'

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({
      data: [],
      error: 'NEXT_PUBLIC_APP_KEY is not configured in environment variables.',
    })
  }
  const { sessionId, user } = getInfo(request)
  try {
    const { data }: any = await client.getConversations(user)
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  }
  catch (error: any) {
    return NextResponse.json({
      data: [],
      error: error.message,
    })
  }
}
