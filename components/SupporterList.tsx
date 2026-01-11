'use client'

interface Supporter {
  id: string
  name: string
  amount: number
  coffeeCount: number
  message?: string
  createdAt: string
}

interface SupporterListProps {
  supporters: Supporter[]
}

export default function SupporterList({ supporters }: SupporterListProps) {
  if (supporters.length === 0) {
    return (
      <div
        className="p-8"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          후원자 목록
        </h2>
        <div
          className="text-center py-12 px-4 rounded-lg"
          style={{
            color: 'var(--muted)',
            backgroundColor: 'var(--background)',
            border: '1px dashed var(--border)'
          }}
        >
          <p>아직 후원자가 없습니다. 첫 번째 후원자가 되어주세요! ☕</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="p-8"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
        후원자 목록
      </h2>
      <div className="flex flex-col gap-4">
        {supporters.map((supporter) => (
          <div
            key={supporter.id}
            className="p-6 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface)'
              e.currentTarget.style.borderColor = 'var(--muted)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--background)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                {supporter.name}
              </div>
              <div className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                {supporter.amount.toLocaleString()}원
              </div>
            </div>
            <div className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
              ☕ × {supporter.coffeeCount}
            </div>
            {supporter.message && (
              <div
                className="p-4 mb-3 rounded-md text-[15px] leading-relaxed"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                {supporter.message}
              </div>
            )}
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(supporter.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
