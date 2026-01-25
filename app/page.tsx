'use client'

import { useState, useEffect, useRef } from 'react'
import Profile from '@/components/Profile'
import ServiceList from '@/components/ServiceList'
import ServicePreview from '@/components/ServicePreview'
// import CoffeeSection from '@/components/CoffeeSection' // [COFFEE_SECTION] 나중에 복원 가능
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
  },
  {
    id: '6',
    name: '투두 타이머',
    description: '할 일 관리와 시간 추적을 결합한 생산성 도구',
    url: 'https://todo-timer-ten.vercel.app/',
    updatedAt: '로딩 중...',
    repository: 'https://github.com/mhoo999/todo-timer'
  }
]

export default function Home() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  // const [scrollY, setScrollY] = useState(0) // [COFFEE_SECTION] 커피 섹션용
  // const [firstSectionHeight, setFirstSectionHeight] = useState(1000) // [COFFEE_SECTION] 커피 섹션용
  const containerRef = useRef<HTMLDivElement>(null)
  // const firstSectionRef = useRef<HTMLDivElement>(null) // [COFFEE_SECTION] 커피 섹션용
  // const secondSectionRef = useRef<HTMLDivElement>(null) // [COFFEE_SECTION] 커피 섹션용

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

  // [COFFEE_SECTION_START] 커피 섹션 복원 시 주석 해제
  /*
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
    const scrollToCoffeeSectionInternal = () => {
      const coffeeElement = document.getElementById('coffee')
      if (coffeeElement) {
        const targetPosition = coffeeElement.offsetTop
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
        return targetPosition
      }
      return null
    }

    // URL 해시 처리: #coffee로 바로 이동
    const handleHashChange = () => {
      if (window.location.hash === '#coffee') {
        setTimeout(() => {
          scrollToCoffeeSectionInternal()
        }, 100)
      }
    }

    // 초기 로드 시 해시 확인
    if (window.location.hash === '#coffee') {
      // 첫 스크롤 실행
      setTimeout(() => {
        const targetPosition = scrollToCoffeeSectionInternal()

        // 레이아웃 변경을 감지하고 위치 보정
        if (targetPosition !== null) {
          const checkAndCorrect = () => {
            const coffeeElement = document.getElementById('coffee')
            if (coffeeElement) {
              const currentTarget = coffeeElement.offsetTop
              const currentScroll = window.scrollY

              // 위치가 틀어졌다면 다시 스크롤
              if (Math.abs(currentScroll - currentTarget) > 50) {
                window.scrollTo({
                  top: currentTarget,
                  behavior: 'smooth'
                })
              }
            }
          }

          // 1초, 1.5초, 2초 후 위치 확인 및 보정
          setTimeout(checkAndCorrect, 1000)
          setTimeout(checkAndCorrect, 1500)
          setTimeout(checkAndCorrect, 2000)
        }
      }, 800) // 컴포넌트 마운트 및 데이터 로딩 대기
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])
  */
  // [COFFEE_SECTION_END]

  // [COFFEE_SECTION_START] 커피 섹션 복원 시 주석 해제
  /*
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
  */
  // [COFFEE_SECTION_END]


  return (
    <div ref={containerRef} style={{ backgroundColor: 'var(--background)' }}>
      {/* 모바일/태블릿 뷰: 세로형 그리드 */}
      <div className="lg:hidden pt-8 px-8 pb-8">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
          {/* 프로필 섹션 */}
          <div>
            {/* [COFFEE_SECTION] Profile의 onCoffeeClick prop 복원 시 추가 */}
            <Profile
              nickname="thinghoon"
              greeting="여러모로 도움이 되는 서비스를 개발하고 있습니다. 좋은 아이디어나 필요한 서비스가 있다면 메일주세요!"
              github="https://github.com/mhoo999"
              email="mhoo999@naver.com"
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

          {/* [COFFEE_SECTION_START] 커피 섹션 복원 시 주석 해제 */}
          {/*
          <div>
            <CoffeeSection />
          </div>
          */}
          {/* [COFFEE_SECTION_END] */}
        </div>
      </div>

      {/* 데스크톱 뷰 */}
      <div className="hidden lg:block">
        {/* 서비스 아카이브 */}
        <div
          className="p-8 md:p-12 lg:p-16"
        >
          <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex gap-8 lg:gap-12">
            {/* 왼쪽: 프로필 섹션 */}
            <div className="w-80 lg:w-96 flex-shrink-0">
              {/* [COFFEE_SECTION] Profile의 onCoffeeClick prop 복원 시 추가 */}
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

        {/* [COFFEE_SECTION_START] 커피 섹션 복원 시 주석 해제 */}
        {/*
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
        */}
        {/* [COFFEE_SECTION_END] */}
      </div>
    </div>
  )
}
