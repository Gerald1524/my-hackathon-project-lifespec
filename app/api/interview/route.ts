import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildMessages, InterviewRequest } from '@/lib/claude'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const body: InterviewRequest = await request.json()

  const system = buildSystemPrompt(body)
  const messages = buildMessages(body)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: body.task === 'synthesize' ? 2000 : 500,
    system,
    messages,
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Parse JSON from Claude's response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Failed to parse Claude response' }, { status: 500 })
  }

  const result = JSON.parse(jsonMatch[0])
  return NextResponse.json(result)
}
