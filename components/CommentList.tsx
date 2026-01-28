'use client'

import { useState, useRef, useEffect } from 'react'

interface Comment {
  id: string
  name: string
  message: string
  createdAt: string
}

interface CommentListProps {
  comments: Comment[]
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
  isLoading?: boolean
}

export default function CommentList({
  comments,
  onLoadMore,
  hasMore = false,
  isLoading = false
}: CommentListProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showLoadMore, setShowLoadMore] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleLoadMore = async () => {
    if (onLoadMore && !isLoadingMore) {
      setIsLoadingMore(true)
      await onLoadMore()
      setIsLoadingMore(false)
    }
  }

  // 더보기 버튼 표시 여부 확인
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        setShowLoadMore(hasMore)
      }
    }

    checkScroll()
    window.addEventListener('resize', checkScroll)
    const observer = new ResizeObserver(checkScroll)
    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current)
    }

    return () => {
      window.removeEventListener('resize', checkScroll)
      observer.disconnect()
    }
  }, [comments, hasMore])

  if (comments.length === 0) {
    return (
      <div
        className="p-6 h-full flex flex-col"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 className="text-xl font-bold mb-6 flex-shrink-0" style={{ color: 'var(--foreground)' }}>
          댓글 목록
        </h2>
        <div
          className="text-center py-12 px-4 rounded-lg flex-1 flex items-center justify-center"
          style={{
            color: 'var(--muted)',
            backgroundColor: 'var(--background)',
            border: '1px dashed var(--border)'
          }}
        >
          <p>아직 댓글이 없습니다. 첫 번째 댓글을 남겨주세요! 💬</p>
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
        댓글 목록
      </h2>
      <div ref={scrollContainerRef} className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
        {comments.map((comment) => (
          <div
            key={comment.id}
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
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {comment.name}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.9 }}>
              {comment.message}
            </div>
          </div>
        ))}
      </div>
      {showLoadMore && (
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
