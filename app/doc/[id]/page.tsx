import { supabase } from '@/lib/supabase'
import { DocumentView } from '@/components/document/DocumentView'
import { DocumentSections } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function DocPage({ params }: Props) {
  const { id } = await params

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return (
      <div style={{ background: '#0D0D0D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#4A4A4A', fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>
          This document does not exist or has expired.
        </p>
      </div>
    )
  }

  const document = data.document as DocumentSections

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', padding: '4rem 2rem' }}>
      <DocumentView document={document} />
      <p style={{
        fontFamily: 'Georgia, serif',
        color: '#4A4A4A',
        fontSize: '0.85rem',
        textAlign: 'center',
        marginTop: '3rem',
        fontStyle: 'italic',
      }}>
        {data.document?.openInvitation}
      </p>
    </div>
  )
}
