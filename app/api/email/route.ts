import { NextRequest, NextResponse } from 'next/server'
import { resend, buildEmailHtml } from '@/lib/resend'
import { supabase } from '@/lib/supabase'
import { DocumentSections } from '@/types'

export async function POST(request: NextRequest) {
  const { email, documentId, document, name }: {
    email: string
    documentId: string
    document: DocumentSections
    name: string
  } = await request.json()

  try {
    await resend.emails.send({
      from: 'LifeSpec <onboarding@resend.dev>',
      to: email,
      subject: `${name}, your LifeSpec document is ready`,
      html: buildEmailHtml(document),
    })

    await supabase
      .from('documents')
      .update({ email })
      .eq('id', documentId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
