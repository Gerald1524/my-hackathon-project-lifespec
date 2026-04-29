import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('audio') as File

  if (!file) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
  }

  const result = await openai.audio.transcriptions.create({
    model: 'gpt-4o-transcribe',
    file,
    language: 'en',
  })

  return NextResponse.json({ transcript: result.text })
}
