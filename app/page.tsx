'use client'

import { useState, useEffect, useRef } from 'react'
import Profile from '@/components/Profile'
import ServiceList from '@/components/ServiceList'
import ServicePreview from '@/components/ServicePreview'
import CoffeeSection from '@/components/CoffeeSection'
import { Service } from '@/types/service'

const initialServices: Service[] = [
  {
    id: '1',
    name: 'CSV 스플리터',
    description: 'CSV 파일의 원하는 컬럼을 선택하여 Excel 파일로 변환한 후 ZIP으로 일괄 다운로드 해주는 서비스',
    url: 'https://csv-splitter-nine.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/csv-splitter'
  },
  {
    id: '2',
    name: '메일 메이커',
    description: '드래그 앤 드롭으로 HTML 이메일 템플릿을 쉽게 제작할 수 있는 비주얼 빌더 서비스',
    url: 'https://mail-maker.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/mail-maker'
  },
  {
    id: '3',
    name: '전화번호 형식 변환기',
    description: '엑셀 파일의 전화번호를 통일된 형식(하이픈 포함/없음)으로 자동 변환해주는 서비스',
    url: 'https://number-integration.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/number-integration'
  },
  {
    id: '4',
    name: '상세 페이지 에디터',
    description: '드래그 앤 드롭으로 상세페이지를 시각적으로 제작하고 HTML로 내보낼 수 있는 빌더 서비스',
    url: 'https://detail-page-builder.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/detail-page-builder'
  },
  {
    id: '5',
    name: '다이스 플리퍼',
    description: '커스터마이즈 가능한 주사위 시뮬레이터',
    url: 'https://dice-flipper.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/dice-flipper'
  }
]

export default function Home() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [firstSectionHeight, setFirstSectionHeight] = useState(1000) // 초기값
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

          try {
            const response = await fetch(`/api/github/commits?repository=${encodeURIComponent(service.repository)}`)
            if (!response.ok) {
              console.error(`Failed to fetch commit date for ${service.repository}:`, response.status)
              return { ...service, updatedAt: '정보 없음' }
            }

            const data = await response.json()
            if (!data.date) {
              return { ...service, updatedAt: '정보 없음' }
            }

            return { ...service, updatedAt: data.date }
          } catch (error) {
            console.error(`Error fetching commit date for ${service.repository}:`, error)
            return { ...service, updatedAt: '정보 없음' }
          }
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
    
    // 두 번째 섹션으로 스크롤 이동 함수 (useEffect 내부에서 정의)
    const scrollToCoffeeSection = () => {
      const height = window.innerHeight
      window.scrollTo({
        top: height,
        behavior: 'smooth'
      })
    }
    
    // URL 해시 처리: #coffee로 바로 이동
    const handleHashChange = () => {
      if (window.location.hash === '#coffee') {
        setTimeout(() => {
          scrollToCoffeeSection()
        }, 100)
      }
    }
    
    // 초기 로드 시 해시 확인
    if (window.location.hash === '#coffee') {
      setTimeout(() => {
        scrollToCoffeeSection()
      }, 300) // 컴포넌트 마운트 후 스크롤
    }
    
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // 첫 번째 섹션의 50% 지점에서 전환
  const transitionPoint = firstSectionHeight * 0.5

  // 현재 페이지 인덱스 계산 (0: 첫 번째, 1: 두 번째)
  const currentPageIndex = scrollY >= transitionPoint ? 1 : 0

  // 두 번째 섹션으로 스크롤 이동
  const scrollToSecondSection = () => {
    window.history.pushState(null, '', '#coffee')
    window.scrollTo({
      top: firstSectionHeight,
      behavior: 'smooth'
    })
  }

  // 커피 섹션으로 스크롤 이동 (모바일/데스크톱 공통)
  const scrollToCoffeeSection = () => {
    // URL 해시 업데이트
    window.history.pushState(null, '', '#coffee')
    
    // 모바일: 커피 섹션 요소 찾아서 스크롤
    const coffeeElement = document.getElementById('coffee')
    if (coffeeElement) {
      coffeeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // 데스크톱: 두 번째 섹션으로 스크롤
      scrollToSecondSection()
    }
  }


  return (
    <div ref={containerRef} style={{ backgroundColor: 'var(--background)' }}>
      {/* 모바일/태블릿 뷰: 세로형 그리드 */}
      <div className="lg:hidden pt-8 px-8 pb-8">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
          {/* 프로필 섹션 */}
          <div>
            <Profile
              nickname="thinghoon"
              greeting="여러모로 도움이 되는 서비스를 개발하고 있습니다. 좋은 아이디어나 필요한 서비스가 있다면 메일주세요!"
              github="https://github.com/mhoo999"
              email="mhoo999@naver.com"
              onCoffeeClick={scrollToCoffeeSection}
            />
          </div>

          {/* 서비스 리스트 */}
          <div>
            <ServiceList
              services={services}
              selectedService={selectedService}
              onSelectService={setSelectedService}
            />
          </div>

          {/* 커피 섹션 */}
          <div>
            <CoffeeSection />
          </div>
        </div>
      </div>

      {/* 데스크톱 뷰: 스크롤 기반 2페이지 구조 */}
      <div className="hidden lg:block">
        {/* 첫 번째 섹션: 서비스 아카이브 */}
        <div
          ref={firstSectionRef}
          className="fixed inset-0 p-8 md:p-12 lg:p-16"
          style={{
            opacity: currentPageIndex === 0 ? 1 : 0,
            pointerEvents: currentPageIndex === 0 ? 'auto' : 'none',
            zIndex: currentPageIndex === 0 ? 10 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex gap-8 lg:gap-12">
            {/* 왼쪽: 프로필 섹션 */}
            <div className="w-80 lg:w-96 flex-shrink-0">
              <Profile
                nickname="thinghoon"
                greeting="여러모로 도움이 되는 서비스를 개발하고 있습니다. 좋은 아이디어나 필요한 서비스가 있다면 메일주세요!"
                github="https://github.com/mhoo999"
                email="mhoo999@naver.com"
                onCoffeeClick={scrollToCoffeeSection}
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
          className="relative"
          style={{
            opacity: currentPageIndex === 1 ? 1 : 0,
            marginTop: `${firstSectionHeight}px`,
            height: `${firstSectionHeight}px`,
            zIndex: currentPageIndex === 1 ? 10 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <CoffeeSection />
        </div>

        {/* 닷 인디케이터 */}
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-row gap-3"
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
    </div>
  )
}
