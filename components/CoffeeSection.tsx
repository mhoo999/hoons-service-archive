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

  useEffect(() => {
    // 후원자 목록 가져오기
    fetchSupporters()
  }, [])

  const fetchSupporters = async () => {
    try {
      const response = await fetch('/api/supporters')
      if (response.ok) {
        const data = await response.json()
        setSupporters(data)
      }
    } catch (error) {
      console.error('후원자 목록 가져오기 실패:', error)
    }
  }

  const handlePaymentSuccess = () => {
    // 결제 성공 후 후원자 목록 새로고침
    fetchSupporters()
  }

  return (
    <div className="h-full p-8 md:p-12 lg:p-16 flex items-center overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
        <div className="text-center mb-6 flex-shrink-0">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            ☕ Buy Me a Coffee
          </h1>
          <p className="text-sm lg:text-base" style={{ color: 'var(--muted)' }}>
            개발을 응원해주세요! 각 커피는 5,000원입니다.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 min-w-0 w-full lg:w-auto flex flex-col gap-4 overflow-y-auto">
            <CoffeeSelector
              count={coffeeCount}
              onCountChange={setCoffeeCount}
            />

            <PaymentForm
              coffeeCount={coffeeCount}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>

          <div className="flex-1 min-w-0 w-full lg:w-auto overflow-y-auto">
            <SupporterList supporters={supporters} />
          </div>
        </div>
      </div>
    </div>
  )
}
