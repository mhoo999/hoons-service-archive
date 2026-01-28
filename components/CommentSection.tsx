'use client'

import { useState, useEffect } from 'react'
import CommentForm from '@/components/CommentForm'
import CommentList from '@/components/CommentList'

interface Comment {
  id: string
  name: string
  message: string
  createdAt: string
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const initialLimit = 10 // 처음에 불러올 댓글 수
  const pageSize = 5 // 더보기 시 한 번에 표시할 댓글 수

  useEffect(() => {
    // 댓글 목록 가져오기
    fetchComments(1, true, initialLimit)
  }, [])

  const fetchComments = async (pageNum: number, reset: boolean = false, limit?: number) => {
    setIsLoading(true)
    try {
      const currentLimit = limit || pageSize
      const response = await fetch(`/api/comments?page=${pageNum}&limit=${currentLimit}`)
      if (response.ok) {
        const data = await response.json()
        if (reset) {
          setComments(data.comments || [])
        } else {
          setComments(prev => [...prev, ...(data.comments || [])])
        }
        setHasMore(data.hasMore || false)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('댓글 목록 가져오기 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (!isLoading && hasMore) {
      await fetchComments(page + 1, false)
    }
  }

  const handleCommentSuccess = () => {
    // 댓글 작성 성공 후 댓글 목록 새로고침
    fetchComments(1, true, initialLimit)
  }

  return (
    <div id="comments" className="h-full pt-8 md:pt-12 lg:pt-16 px-0 lg:px-16 pb-24 md:pb-28 lg:pb-32 flex items-center overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
        <div className="text-center mb-6 flex-shrink-0">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            💬 방명록
          </h1>
          <p className="text-sm lg:text-base" style={{ color: 'var(--muted)' }}>
            자유롭게 댓글을 남겨주세요!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch flex-1 min-h-0">
          <div className="flex-1 min-w-0 w-full lg:w-auto flex flex-col lg:flex-shrink-0">
            <CommentForm onCommentSuccess={handleCommentSuccess} />
          </div>

          <div className="flex-1 min-w-0 w-full lg:w-auto flex flex-col min-h-0 max-h-[600px] lg:max-h-full">
            <CommentList
              comments={comments}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
