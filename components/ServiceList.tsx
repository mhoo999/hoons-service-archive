'use client'

import { useState, useRef, useEffect } from 'react'
import { Service } from '@/types/service'

interface ServiceListProps {
  services: Service[]
  selectedService: Service | null
  onSelectService: (service: Service | null) => void
}

export default function ServiceList({
  services,
  selectedService,
  onSelectService
}: ServiceListProps) {
  const formatDate = (dateStr: string) => {
    if (dateStr === '로딩 중...' || dateStr === '레포지토리 없음' || dateStr === '정보 없음') {
      return dateStr
    }
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR')
    } catch {
      return dateStr
    }
  }

  const handleServiceClick = (service: Service) => {
    // 같은 서비스를 클릭하면 토글, 다른 서비스를 클릭하면 선택
    if (selectedService?.id === service.id) {
      onSelectService(null) // 접기
    } else {
      onSelectService(service) // 펼치기
    }
  }

  return (
    <div
      className="md:h-full md:overflow-y-auto p-8"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      <h2
        className="text-sm font-semibold mb-6 tracking-wide"
        style={{ color: 'var(--muted)' }}
      >
        SERVICES
      </h2>
      <div className="space-y-3">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id
          
          return (
            <ServiceItem
              key={service.id}
              service={service}
              isSelected={isSelected}
              onSelect={() => handleServiceClick(service)}
              formatDate={formatDate}
            />
          )
        })}
      </div>
    </div>
  )
}

interface ServiceItemProps {
  service: Service
  isSelected: boolean
  onSelect: () => void
  formatDate: (dateStr: string) => string
}

function ServiceItem({ service, isSelected, onSelect, formatDate }: ServiceItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  useEffect(() => {
    if (contentRef.current) {
      if (isSelected) {
        // 펼칠 때: 실제 높이 측정 (다음 프레임에서 측정하여 정확도 향상)
        requestAnimationFrame(() => {
          if (contentRef.current) {
            const height = contentRef.current.scrollHeight
            setMaxHeight(height)
          }
        })
      } else {
        // 접을 때: 0으로 설정
        setMaxHeight(0)
      }
    }
  }, [isSelected])

  // 콘텐츠가 변경될 때 높이 재계산
  useEffect(() => {
    if (isSelected && contentRef.current) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          const height = contentRef.current.scrollHeight
          setMaxHeight(height)
        }
      })
    }
  }, [service.description, service.url, isSelected])

  return (
    <div
      className="w-full transition-colors duration-200"
      style={{
        border: '1px solid var(--border)',
        backgroundColor: isSelected ? 'var(--foreground)' : 'transparent'
      }}
    >
      <button
        onClick={onSelect}
        className="w-full text-left p-4 transition-colors duration-200"
        style={{
          backgroundColor: 'transparent',
          color: isSelected ? 'var(--surface)' : 'var(--foreground)'
        }}
      >
        <h3 className="font-medium mb-2 text-sm">{service.name}</h3>
        <p
          className="text-xs"
          style={{
            color: isSelected ? 'var(--surface)' : 'var(--muted)',
            opacity: 0.8
          }}
        >
          {formatDate(service.updatedAt)}
        </p>
      </button>
      
      {/* 아코디언 콘텐츠 (모바일만 표시) */}
      <div
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: `${maxHeight}px`,
          opacity: maxHeight > 0 ? 1 : 0,
          transitionProperty: 'max-height, opacity',
          transitionDuration: '300ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div ref={contentRef} className="px-4 pb-4 pt-0">
          <div className="pt-4 border-t" style={{ borderColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'var(--border)' }}>
            <p
              className="text-sm mb-4 leading-relaxed"
              style={{
                color: isSelected ? 'var(--surface)' : 'var(--foreground)',
                opacity: isSelected ? 0.9 : 0.8
              }}
            >
              {service.description}
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:opacity-80 transition-opacity break-all"
                style={{
                  color: isSelected ? 'var(--surface)' : 'var(--foreground)',
                  textDecoration: 'underline',
                  opacity: isSelected ? 0.9 : 0.7
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {service.url}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
