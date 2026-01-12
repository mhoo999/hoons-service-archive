'use client'

import { Service } from '@/types/service'

interface ServiceListProps {
  services: Service[]
  selectedService: Service | null
  onSelectService: (service: Service) => void
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
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelectService(service)}
            className="w-full text-left p-4 transition-all"
            style={{
              backgroundColor: selectedService?.id === service.id ? 'var(--foreground)' : 'transparent',
              color: selectedService?.id === service.id ? 'var(--surface)' : 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
          >
            <h3 className="font-medium mb-2 text-sm">{service.name}</h3>
            <p
              className="text-xs"
              style={{
                color: selectedService?.id === service.id ? 'var(--surface)' : 'var(--muted)',
                opacity: 0.8
              }}
            >
              {formatDate(service.updatedAt)}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
