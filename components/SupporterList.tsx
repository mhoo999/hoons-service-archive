'use client'

import { useState } from 'react'

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
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
  isLoading?: boolean
}

export default function SupporterList({ 
  supporters, 
  onLoadMore, 
  hasMore = false,
  isLoading = false 
}: SupporterListProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleLoadMore = async () => {
    if (onLoadMore && !isLoadingMore) {
      setIsLoadingMore(true)
      await onLoadMore()
      setIsLoadingMore(false)
    }
  }

  if (supporters.length === 0) {
    return (
      <div
        className="p-6 h-full flex flex-col"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 className="text-xl font-bold mb-6 flex-shrink-0" style={{ color: 'var(--foreground)' }}>
          후원자 목록
        </h2>
        <div
          className="text-center py-12 px-4 rounded-lg flex-1 flex items-center justify-center"
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
      className="p-6 h-full flex flex-col min-h-0"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      <h2 className="text-xl font-bold mb-4 flex-shrink-0" style={{ color: 'var(--foreground)' }}>
        후원자 목록
      </h2>
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
        {supporters.map((supporter) => (
          <div
            key={supporter.id}
            className="p-4 rounded-lg transition-all flex-shrink-0"
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
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {supporter.name}
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                {supporter.amount.toLocaleString()}원
              </div>
            </div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
              ☕ × {supporter.coffeeCount}
            </div>
            {supporter.message && (
              <div
                className="p-3 mb-2 rounded-md text-sm leading-relaxed"
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
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore || isLoading}
          className="mt-4 py-2 px-4 text-sm font-medium transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--surface)',
            border: '1px solid var(--foreground)'
          }}
          onMouseEnter={(e) => {
            if (!isLoadingMore && !isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--muted)'
              e.currentTarget.style.borderColor = 'var(--muted)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoadingMore && !isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--foreground)'
              e.currentTarget.style.borderColor = 'var(--foreground)'
            }
          }}
        >
          {isLoadingMore || isLoading ? '로딩 중...' : '더 보기'}
        </button>
      )}
    </div>
  )
}
