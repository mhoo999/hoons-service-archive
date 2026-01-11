'use client'

import { useState } from 'react'

interface PaymentFormProps {
  coffeeCount: number
  onPaymentSuccess: () => void
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || ''

export default function PaymentForm({
  coffeeCount,
  onPaymentSuccess,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [donorName, setDonorName] = useState('')
  const [message, setMessage] = useState('')

  const totalAmount = coffeeCount * 5000

  const handlePayment = async () => {
    if (!donorName.trim()) {
      alert('이름을 입력해주세요.')
      return
    }

    if (!clientKey) {
      alert('개발중입니다.')
      return
    }

    setLoading(true)

    try {
      // 결제 요청 API 호출
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          orderId: `order-${Date.now()}`,
          orderName: `커피 ${coffeeCount}잔`,
          customerName: donorName,
          customerEmail: `customer-${Date.now()}@example.com`,
          message: message.trim(),
          coffeeCount,
        }),
      })

      if (!response.ok) {
        throw new Error('결제 요청 실패')
      }

      const { paymentUrl } = await response.json()

      // 결제 페이지로 리다이렉트
      window.location.href = paymentUrl
    } catch (error: any) {
      console.error('결제 처리 실패:', error)
      alert(`결제 처리 중 오류가 발생했습니다: ${error.message}`)
      setLoading(false)
    }
  }

  return (
    <div
      className="p-6 flex-1 flex flex-col"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2 flex-shrink-0">
          <label htmlFor="donorName" className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            이름 *
          </label>
          <input
            id="donorName"
            type="text"
            className="px-4 py-3.5 border rounded-lg transition-all focus:outline-none"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--foreground)'
            }}
            placeholder="후원자 이름을 입력해주세요"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--foreground)'
              e.currentTarget.style.backgroundColor = 'var(--background)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.backgroundColor = 'var(--surface)'
            }}
            required
          />
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label htmlFor="message" className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--foreground)' }}>
            댓글 (선택)
          </label>
          <textarea
            id="message"
            className="px-4 py-2.5 border rounded-lg transition-all focus:outline-none resize-none flex-1"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--foreground)',
              fontFamily: 'inherit'
            }}
            placeholder="댓글을 남겨주세요 (선택사항)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--foreground)'
              e.currentTarget.style.backgroundColor = 'var(--background)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.backgroundColor = 'var(--surface)'
            }}
          />
        </div>

        <button
          className="py-3 px-6 font-semibold transition-all rounded-lg mt-auto flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--surface)',
            border: '1px solid var(--foreground)'
          }}
          onClick={handlePayment}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'var(--muted)'
              e.currentTarget.style.borderColor = 'var(--muted)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'var(--foreground)'
              e.currentTarget.style.borderColor = 'var(--foreground)'
            }
          }}
        >
          {loading ? '처리 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
        </button>
      </div>
    </div>
  )
}
