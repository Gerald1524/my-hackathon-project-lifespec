'use client'

interface Props {
  completedQuestions: number  // 0–9
}

export function ProgressSymbol({ completedQuestions }: Props) {
  const total = 9
  const cx = 50
  const cy = 50
  const r = 38
  const innerR = 20
  const gapAngle = 4  // degrees gap between segments

  const segments = Array.from({ length: total }, (_, i) => {
    const startAngle = (i * 360) / total - 90 + gapAngle / 2
    const endAngle = ((i + 1) * 360) / total - 90 - gapAngle / 2
    const start = polarToCartesian(cx, cy, r, startAngle)
    const end = polarToCartesian(cx, cy, r, endAngle)
    const innerStart = polarToCartesian(cx, cy, innerR, endAngle)
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle)

    const d = [
      `M ${start.x} ${start.y}`,
      `A ${r} ${r} 0 0 1 ${end.x} ${end.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 0 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ')

    const filled = i < completedQuestions
    return { d, filled }
  })

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        style={{ transition: 'all 0.5s ease' }}
      >
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg.d}
            fill={seg.filled ? 'var(--gold)' : 'var(--muted)'}
            opacity={seg.filled ? 0.9 : 0.25}
            style={{ transition: 'fill 1.2s ease, opacity 1.2s ease' }}
          />
        ))}
      </svg>
    </div>
  )
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: +(cx + r * Math.cos(rad)).toFixed(4),
    y: +(cy + r * Math.sin(rad)).toFixed(4),
  }
}
