import type { NextRequest } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  try {
    const body = await request.json()
    const {
      inputs,
      query,
      files,
      conversation_id: conversationId,
      response_mode: responseMode,
    } = body

    let res
    try {
      res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files)
    }
    catch (err: any) {
      if (conversationId) {
        console.warn('createChatMessage failed with conversationId, retrying without conversationId:', err?.message || err)
        res = await client.createChatMessage(inputs, query, user, responseMode, null, files)
      }
      else {
        throw err
      }
    }

    return new Response(res.data as any, {
      headers: setSession(sessionId),
    })
  }
  catch (error: any) {
    console.error('Error in chat-messages API:', error)
    return new Response(
      JSON.stringify({
        code: 'chat_error',
        message: error?.response?.data?.message || error?.message || 'Failed to send message',
        status: 500,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...setSession(sessionId),
        },
      },
    )
  }
}
