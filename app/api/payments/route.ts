import { NextRequest, NextResponse } from 'next/server'

// 페이앱 API 엔드포인트
const PAYAPP_API_URL = 'https://api.payapp.kr/oapi/apiLoad.html'

// 페이앱 설정
const PAYAPP_USER_ID = process.env.PAYAPP_USER_ID || ''
const PAYAPP_LINK_KEY = process.env.PAYAPP_LINK_KEY || ''
const PAYAPP_LINK_VAL = process.env.PAYAPP_LINK_VAL || ''
const PAYAPP_SHOP_NAME = process.env.PAYAPP_SHOP_NAME || '훈스 서비스 아카이브'

// BASE_URL 설정 (프로덕션 도메인 사용)
const getBaseUrl = () => {
  // 프로덕션 도메인 우선 사용
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  // 기본 프로덕션 도메인
  if (process.env.NODE_ENV === 'production') {
    return 'https://hoons-service-archive.vercel.app'
  }
  // 개발 환경
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

const BASE_URL = getBaseUrl()

// 결제 요청 정보 임시 저장소 (실제로는 데이터베이스 사용 권장)
// 메모리 저장소이므로 서버 재시작 시 초기화됨
// Feedback API에서 접근할 수 있도록 global에 저장
const paymentRequests = new Map<string, any>()
if (typeof global !== 'undefined') {
  (global as any).paymentRequests = paymentRequests
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, orderName, customerName, customerPhone, customerEmail, message, coffeeCount } = body

    if (!PAYAPP_USER_ID || !PAYAPP_LINK_KEY || !PAYAPP_LINK_VAL) {
      return NextResponse.json(
        { error: '페이앱 설정이 완료되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 결제 요청 정보 저장 (Feedback에서 사용)
    paymentRequests.set(orderId, {
      orderId,
      orderName,
      amount,
      customerName,
      customerPhone,
      customerEmail,
      message,
      coffeeCount,
      createdAt: new Date().toISOString(),
    })

    // Feedback URL 생성
    const feedbackUrl = `${BASE_URL}/api/payments/feedback`
    console.log('[DEBUG] Feedback URL:', feedbackUrl)
    console.log('[DEBUG] BASE_URL:', BASE_URL)
    console.log('[DEBUG] VERCEL_URL:', process.env.VERCEL_URL)
    console.log('[DEBUG] NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)

    // 페이앱 결제 요청 API 호출
    // var1: orderId (Feedback에서 조회용)
    // var2: customerName (이름만 저장, 메시지는 paymentRequests에서 조회)
    const params = new URLSearchParams({
      cmd: 'payrequest',
      userid: PAYAPP_USER_ID,
      linkkey: PAYAPP_LINK_KEY,
      linkval: PAYAPP_LINK_VAL,
      shopname: PAYAPP_SHOP_NAME,
      goodname: orderName,
      price: amount.toString(),
      recvphone: customerPhone || '01000000000', // 전화번호 (테스트용 기본값)
      var1: orderId, // 주문 ID를 var1에 저장 (Feedback에서 paymentRequests 조회용)
      var2: customerName, // 고객 이름을 var2에 저장
      // var3는 공식 지원되지 않으므로 paymentRequests에서 message 조회
      feedbackurl: feedbackUrl,
    })
    
    console.log('[DEBUG] 페이앱 요청 파라미터:', {
      cmd: 'payrequest',
      userid: PAYAPP_USER_ID,
      shopname: PAYAPP_SHOP_NAME,
      goodname: orderName,
      price: amount.toString(),
      feedbackurl: feedbackUrl,
    })

    const response = await fetch(PAYAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    // 응답을 먼저 텍스트로 받아서 확인
    const responseText = await response.text()
    console.log('페이앱 API 응답:', responseText)

    if (!response.ok) {
      throw new Error(`페이앱 결제 요청 실패: ${responseText}`)
    }

    // URL 인코딩된 응답을 파싱
    const data: Record<string, string> = {}
    const responseParams = new URLSearchParams(responseText)
    responseParams.forEach((value, key) => {
      data[key] = value
    })

    if (data.state !== '1') {
      throw new Error(data.errorMessage || '페이앱 결제 요청 실패')
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount,
      orderName,
      paymentUrl: data.payurl,
      mul_no: data.mul_no,
    })
  } catch (error: any) {
    console.error('결제 요청 처리 오류:', error)
    return NextResponse.json(
      { error: error.message || '결제 요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
