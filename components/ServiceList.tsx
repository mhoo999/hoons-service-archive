'use client'

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
            <div
              key={service.id}
              className="w-full transition-all"
              style={{
                border: '1px solid var(--border)',
                backgroundColor: isSelected ? 'var(--foreground)' : 'transparent'
              }}
            >
              <button
                onClick={() => handleServiceClick(service)}
                className="w-full text-left p-4 transition-all"
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
              
              {/* 아코디언 콘텐츠 */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isSelected ? '500px' : '0',
                  opacity: isSelected ? 1 : 0
                }}
              >
                <div className="px-4 pb-4 pt-0">
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
                      {service.repository && (
                        <a
                          href={service.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:opacity-80 transition-opacity break-all"
                          style={{
                            color: isSelected ? 'var(--surface)' : 'var(--muted)',
                            textDecoration: 'underline',
                            opacity: isSelected ? 0.7 : 0.6
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {service.repository}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
