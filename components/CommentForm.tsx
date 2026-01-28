'use client'

import { useState } from 'react'

interface CommentFormProps {
  onCommentSuccess: () => void
}

export default function CommentForm({ onCommentSuccess }: CommentFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !message.trim()) {
      alert('이름과 댓글을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
        }),
      })

      if (response.ok) {
        alert('댓글이 작성되었습니다!')
        setName('')
        setMessage('')
        onCommentSuccess()
      } else {
        const error = await response.json()
        alert(error.error || '댓글 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error)
      alert('댓글 작성 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="p-6 h-full flex flex-col"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
        댓글 작성
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full px-4 py-2 text-sm"
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            }}
            disabled={isSubmitting}
            maxLength={50}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label
            htmlFor="message"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            댓글
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="자유롭게 댓글을 남겨주세요"
            className="w-full px-4 py-2 text-sm resize-none flex-1"
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              minHeight: '120px',
            }}
            disabled={isSubmitting}
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--surface)',
          }}
        >
          {isSubmitting ? '작성 중...' : '댓글 작성'}
        </button>
      </form>
    </div>
  )
}
