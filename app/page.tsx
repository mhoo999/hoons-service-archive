'use client'

import { useState, useEffect, useRef } from 'react'
import Profile from '@/components/Profile'
import ServiceList from '@/components/ServiceList'
import ServicePreview from '@/components/ServicePreview'
import CoffeeSection from '@/components/CoffeeSection'
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
  const [scrollY, setScrollY] = useState(0)
  const [firstSectionHeight, setFirstSectionHeight] = useState(1000) // 초기값은 서버와 클라이언트 동일하게
  const containerRef = useRef<HTMLDivElement>(null)
  const firstSectionRef = useRef<HTMLDivElement>(null)
  const secondSectionRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    // 클라이언트에서만 높이 계산
    const updateHeight = () => {
      setFirstSectionHeight(window.innerHeight)
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  // URL 해시로 섹션 이동 처리 (높이가 계산된 후에만 실행)
  useEffect(() => {
    if (firstSectionHeight === 1000) return // 초기값이면 아직 높이가 계산되지 않음

    const scrollToCoffeeSection = () => {
      window.scrollTo({
        top: firstSectionHeight,
        behavior: 'smooth'
      })
    }

    const handleHashChange = () => {
      if (window.location.hash === '#coffee') {
        setTimeout(scrollToCoffeeSection, 100)
      }
    }

    // 초기 로드 시 해시 확인
    if (window.location.hash === '#coffee') {
      // 높이가 계산될 때까지 대기
      setTimeout(scrollToCoffeeSection, 500)
    }

    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [firstSectionHeight])

  // 전환 시작 지점 (첫 번째 섹션의 80% 지점)
  const transitionStart = firstSectionHeight * 0.8
  // 전환 완료 지점 (첫 번째 섹션의 끝)
  const transitionEnd = firstSectionHeight
  // 전환 범위
  const transitionRange = transitionEnd - transitionStart

  // 스크롤 위치에 따른 전환 진행도 (0 ~ 1)
  const transitionProgress = Math.min(
    Math.max((scrollY - transitionStart) / transitionRange, 0),
    1
  )

  // 현재 페이지 인덱스 계산 (0: 첫 번째, 1: 두 번째)
  const currentPageIndex = transitionProgress > 0.5 ? 1 : 0

  // 두 번째 섹션으로 스크롤 이동
  const scrollToSecondSection = () => {
    window.scrollTo({
      top: firstSectionHeight,
      behavior: 'smooth'
    })
  }

  return (
    <div ref={containerRef} style={{ backgroundColor: 'var(--background)' }}>
      {/* 첫 번째 섹션: 서비스 아카이브 */}
      <div
        ref={firstSectionRef}
        className="fixed inset-0 pt-8 md:pt-12 lg:pt-16 px-8 md:px-12 lg:px-16 pb-32 md:pb-36 lg:pb-40 transition-all duration-300 ease-out"
        style={{
          opacity: 1 - transitionProgress,
          transform: `translateY(${-transitionProgress * 20}px)`,
          pointerEvents: currentPageIndex === 0 ? 'auto' : 'none',
          zIndex: currentPageIndex === 0 ? 10 : 0
        }}
      >
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-12rem)] flex gap-8 lg:gap-12">
          {/* 왼쪽: 프로필 섹션 */}
          <div className="w-80 lg:w-96 flex-shrink-0">
            <Profile
              nickname="thinghoon"
              greeting="여러모로 도움이 되는 서비스를 개발하고 있습니다. 좋은 아이디어나 필요한 서비스가 있다면 메일주세요!"
              github="https://github.com/mhoo999"
              email="mhoo999@naver.com"
              onCoffeeClick={scrollToSecondSection}
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

      {/* 두 번째 섹션: 커피 후원 */}
      <div
        ref={secondSectionRef}
        className="relative transition-all duration-300 ease-out"
        style={{
          opacity: transitionProgress,
          transform: `translateY(${(1 - transitionProgress) * 20}px)`,
          marginTop: `${firstSectionHeight}px`,
          height: `${firstSectionHeight}px`,
          zIndex: currentPageIndex === 1 ? 10 : 0
        }}
      >
        <CoffeeSection />
      </div>

      {/* 닷 인디케이터 */}
      <div
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-row gap-3"
        style={{ zIndex: 20 }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-3 h-3 rounded-full transition-all"
          style={{
            backgroundColor: currentPageIndex === 0 ? 'var(--foreground)' : 'var(--muted)',
            opacity: currentPageIndex === 0 ? 1 : 0.4
          }}
          aria-label="첫 번째 페이지"
        />
        <button
          onClick={() => window.scrollTo({ top: firstSectionHeight, behavior: 'smooth' })}
          className="w-3 h-3 rounded-full transition-all"
          style={{
            backgroundColor: currentPageIndex === 1 ? 'var(--foreground)' : 'var(--muted)',
            opacity: currentPageIndex === 1 ? 1 : 0.4
          }}
          aria-label="두 번째 페이지"
        />
      </div>
    </div>
  )
}
