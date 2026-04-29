import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { DocumentSections } from '@/types'

export async function POST(request: NextRequest) {
  const { name, document }: { name: string; document: DocumentSections } = await request.json()

  const { data, error } = await supabase
    .from('documents')
    .insert({ name, document })
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Insert failed' }, { status: 500 })
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/doc/${data.id}`
  return NextResponse.json({ id: data.id, url })
}
