import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request: NextRequest) {
  const { text } = await request.json()

  const response = await openai.audio.speech.create({
    model: 'gpt-4o-mini-tts',
    voice: 'nova',
    input: text,
  })

  const buffer = Buffer.from(await response.arrayBuffer())

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length.toString(),
    },
  })
}
