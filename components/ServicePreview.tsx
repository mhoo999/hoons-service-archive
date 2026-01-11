'use client'

import { Service } from '@/types/service'
import { useState, useEffect, useRef } from 'react'

interface ServicePreviewProps {
  service: Service | null
}

export default function ServicePreview({ service }: ServicePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  const DESKTOP_WIDTH = 1440
  const DESKTOP_HEIGHT = 900

  // service가 바뀔 때마다 상태 초기화
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setScale(1)
  }, [service])

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const PADDING = 16 // padding 4px * 2 (양쪽) + 테두리 2px * 2 (양쪽) = 12px, 여유 4px
        const containerWidth = containerRef.current.clientWidth - PADDING
        const containerHeight = containerRef.current.clientHeight - PADDING

        const scaleX = containerWidth / DESKTOP_WIDTH
        const scaleY = containerHeight / DESKTOP_HEIGHT
        const newScale = Math.min(scaleX, scaleY)

        setScale(newScale)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [service])

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

  if (!service) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)'
        }}
      >
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          서비스를 선택해주세요
        </p>
      </div>
    )
  }

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2
          className="text-base font-semibold mb-2"
          style={{ color: 'var(--foreground)' }}
        >
          {service.name}
        </h2>
        <p
          className="text-xs mb-3 leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {service.description}
        </p>
        <div className="flex flex-col gap-1">
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:opacity-60 transition-opacity"
            style={{ color: 'var(--foreground)' }}
          >
            {service.url}
          </a>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            업데이트: {formatDate(service.updatedAt)}
          </span>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 relative p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              로딩 중...
            </div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              미리보기를 불러올 수 없습니다
            </p>
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--foreground)',
                color: 'var(--surface)'
              }}
            >
              새 탭에서 열기
            </a>
          </div>
        ) : (
          <div
            className="relative overflow-hidden"
            style={{
              width: `${DESKTOP_WIDTH * scale}px`,
              height: `${DESKTOP_HEIGHT * scale}px`,
              maxWidth: '100%',
              maxHeight: '100%',
              border: '2px solid var(--border)',
              backgroundColor: 'var(--surface)'
            }}
          >
            <div
              style={{
                width: `${DESKTOP_WIDTH}px`,
                height: `${DESKTOP_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
              }}
            >
              <iframe
                src={service.url}
                className="border-0"
                title={service.name}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                style={{
                  width: `${DESKTOP_WIDTH}px`,
                  height: `${DESKTOP_HEIGHT}px`,
                  pointerEvents: 'none'
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false)
                  setHasError(true)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
