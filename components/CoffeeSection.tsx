'use client'

import { useState, useEffect } from 'react'
import CoffeeSelector from '@/components/CoffeeSelector'
import PaymentForm from '@/components/PaymentForm'
import SupporterList from '@/components/SupporterList'

interface Supporter {
  id: string
  name: string
  amount: number
  coffeeCount: number
  message?: string
  createdAt: string
}

export default function CoffeeSection() {
  const [coffeeCount, setCoffeeCount] = useState(1)
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const initialLimit = 10 // 처음에 불러올 후원자 수
  const pageSize = 5 // 더보기 시 한 번에 표시할 후원자 수

  useEffect(() => {
    // 후원자 목록 가져오기
    fetchSupporters(1, true, initialLimit)
  }, [])

  const fetchSupporters = async (pageNum: number, reset: boolean = false, limit?: number) => {
    setIsLoading(true)
    try {
      const currentLimit = limit || pageSize
      const response = await fetch(`/api/supporters?page=${pageNum}&limit=${currentLimit}`)
      if (response.ok) {
        const data = await response.json()
        if (reset) {
          setSupporters(data.supporters || [])
        } else {
          setSupporters(prev => [...prev, ...(data.supporters || [])])
        }
        setHasMore(data.hasMore || false)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('후원자 목록 가져오기 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (!isLoading && hasMore) {
      await fetchSupporters(page + 1, false)
    }
  }

  const handlePaymentSuccess = () => {
    // 결제 성공 후 후원자 목록 새로고침
    fetchSupporters(1, true)
  }

  return (
    <div id="coffee" className="h-full pt-8 md:pt-12 lg:pt-16 px-0 lg:px-16 pb-24 md:pb-28 lg:pb-32 flex items-center overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
        <div className="text-center mb-6 flex-shrink-0">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            ☕ Buy Me a Coffee
          </h1>
          <p className="text-sm lg:text-base" style={{ color: 'var(--muted)' }}>
            개발을 응원해주세요! 각 커피는 5,000원입니다.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch flex-1 min-h-0">
          <div className="flex-1 min-w-0 w-full lg:w-auto flex flex-col gap-4">
            <CoffeeSelector
              count={coffeeCount}
              onCountChange={setCoffeeCount}
            />

            <PaymentForm
              coffeeCount={coffeeCount}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>

          <div className="flex-1 min-w-0 w-full lg:w-auto flex flex-col">
            <SupporterList
              supporters={supporters}
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
