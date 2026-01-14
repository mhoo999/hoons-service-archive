'use client'

import { useState, useEffect } from 'react'

interface PaymentFormProps {
  coffeeCount: number
  onPaymentSuccess: () => void
}

export default function PaymentForm({
  coffeeCount,
  onPaymentSuccess,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [donorName, setDonorName] = useState('')
  const [message, setMessage] = useState('')

  const totalAmount = coffeeCount * 5000

  // 결제 완료 후 새창에서 메시지를 받으면 후원자 목록 업데이트
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 보안을 위해 같은 origin에서만 메시지 수신
      if (event.data?.type === 'PAYMENT_SUCCESS') {
        console.log('결제 완료 메시지 수신:', event.data)
        onPaymentSuccess()
        setLoading(false)
        setDonorName('')
        setMessage('')
        alert('결제가 완료되었습니다! 감사합니다.')
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onPaymentSuccess])

  const handlePayment = async () => {
    if (!donorName.trim()) {
      alert('이름을 입력해주세요.')
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
          customerPhone: '01000000000', // 자동으로 더미 전화번호 사용
          customerEmail: `customer-${Date.now()}@example.com`,
          message: message.trim(),
          coffeeCount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '결제 요청 실패')
      }

      const { paymentUrl, orderId } = await response.json()

      // 페이앱 결제 페이지를 새창으로 열기
      const paymentWindow = window.open(paymentUrl, '_blank')
      
      if (paymentWindow) {
        // 결제 창이 닫혔을 때만 후원자 목록 새로고침
        const checkClosed = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkClosed)
            // 결제 창이 닫혔을 때, 잠시 후 후원자 목록 새로고침 (Feedback API 처리 시간 고려)
            setTimeout(() => {
              onPaymentSuccess()
              setLoading(false)
              setDonorName('')
              setMessage('')
            }, 3000) // Feedback API 처리 시간 고려하여 3초 대기
          }
        }, 1000) // 1초마다 확인

        // 최대 5분 후 폴링 중지
        setTimeout(() => {
          clearInterval(checkClosed)
          if (!paymentWindow.closed) {
            setLoading(false)
          }
        }, 300000) // 5분
      } else {
        // 팝업이 차단된 경우
        alert('팝업이 차단되었습니다. 팝업을 허용해주세요.')
        setLoading(false)
      }

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
            autoComplete="name"
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
              // 자동완성 목록 클릭을 위한 지연 처리
              setTimeout(() => {
                // blur 후에도 focus가 유지되면 (자동완성 클릭) 스타일 유지
                if (e.currentTarget && document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.backgroundColor = 'var(--surface)'
                }
              }, 200)
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
