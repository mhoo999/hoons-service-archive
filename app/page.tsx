'use client'

import { useState, useEffect } from 'react'
import Profile from '@/components/Profile'
import ServiceList from '@/components/ServiceList'
import ServicePreview from '@/components/ServicePreview'
import { Service } from '@/types/service'
import { getLatestCommitDate } from '@/utils/github'

const initialServices: Service[] = [
  {
    id: '1',
    name: 'CSV 스플리터',
    description: 'CSV 파일의 원하는 컬럼을 선택하여 Excel 파일로 변환한 후 ZIP으로 일괄 다운로드',
    url: 'https://csv-splitter-nine.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/csv-splitter'
  },
  {
    id: '2',
    name: '메일 메이커',
    description: '드래그 앤 드롭으로 HTML 이메일 템플릿을 쉽게 제작하는 비주얼 빌더',
    url: 'https://mail-maker.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/mail-maker'
  },
  {
    id: '3',
    name: '전화번호 형식 통일',
    description: '엑셀 파일의 전화번호를 통일된 형식(하이픈 포함/없음)으로 자동 변환',
    url: 'https://number-integration.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/number-integration'
  },
  {
    id: '4',
    name: '상세 페이지 에디터',
    description: '드래그 앤 드롭으로 상세페이지를 시각적으로 제작하고 HTML로 내보내는 빌더',
    url: 'https://detail-page-builder.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/detail-page-builder'
  }
]

export default function Home() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    const fetchCommitDates = async () => {
      const updatedServices = await Promise.all(
        initialServices.map(async (service) => {
          if (!service.repository) {
            return { ...service, updatedAt: '레포지토리 없음' }
          }

          const commitDate = await getLatestCommitDate(service.repository)
          if (!commitDate) {
            return { ...service, updatedAt: '정보 없음' }
          }

          return { ...service, updatedAt: commitDate }
        })
      )

      setServices(updatedServices)
    }

    fetchCommitDates()
  }, [])

  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex gap-8 lg:gap-12">
        {/* 왼쪽: 프로필 섹션 */}
        <div className="w-80 lg:w-96 flex-shrink-0">
          <Profile
            nickname="thinghoon"
            greeting="여러모로 도움이 되는 서비스를 개발하고 있습니다. 좋은 아이디어나 필요한 서비스가 있다면 메일주세요!"
            github="https://github.com/mhoo999"
            email="mhoo999@naver.com"
          />
        </div>

        {/* 오른쪽: 서비스 리스트 컨테이너 */}
        <div className="flex-1 flex gap-8 lg:gap-12 min-w-0">
          {/* 서비스 리스트 */}
          <div className="w-80 lg:w-96 flex-shrink-0">
            <ServiceList
              services={services}
              selectedService={selectedService}
              onSelectService={setSelectedService}
            />
          </div>

          {/* 서비스 미리보기 */}
          <div className="flex-1 min-w-0">
            <ServicePreview service={selectedService} />
          </div>
        </div>
      </div>
    </div>
  )
}
