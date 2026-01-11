import { NextRequest, NextResponse } from 'next/server'

// 토스페이먼츠 API 엔드포인트
const TOSS_PAYMENTS_SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY || ''
const TOSS_PAYMENTS_URL = 'https://api.tosspayments.com/v1/payments/confirm'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// 임시 데이터 저장소 (실제로는 데이터베이스 사용 권장)
// 이 예제에서는 메모리 저장소 사용
let paymentRequests: Map<string, any> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, orderName, customerName, customerEmail, message, coffeeCount } = body

    if (!TOSS_PAYMENTS_SECRET_KEY) {
      return NextResponse.json(
        { error: '토스페이먼츠 시크릿 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 결제 요청 정보 저장 (결제 승인 시 사용)
    paymentRequests.set(orderId, {
      orderId,
      orderName,
      amount,
      customerName,
      customerEmail,
      message,
      coffeeCount,
    })

    // 토스페이먼츠 결제 페이지 URL 생성
    // 실제로는 토스페이먼츠의 결제 위젯을 사용하거나, 직접 결제 페이지로 리다이렉트합니다
    // 여기서는 간단하게 결제 승인을 위한 정보를 반환합니다
    // 실제 환경에서는 토스페이먼츠 위젯을 사용하는 것이 좋습니다

    return NextResponse.json({
      success: true,
      orderId,
      amount,
      orderName,
      paymentUrl: `${BASE_URL}/payment/checkout?orderId=${orderId}&amount=${amount}`,
    })
  } catch (error: any) {
    console.error('결제 요청 처리 오류:', error)
    return NextResponse.json(
      { error: error.message || '결제 요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 결제 승인 API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 }
    )
  }

  try {
    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch(TOSS_PAYMENTS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(TOSS_PAYMENTS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: parseInt(amount),
      }),
    })

    if (!response.ok) {
      throw new Error('결제 승인 실패')
    }

    const data = await response.json()

    // 결제 요청 정보 가져오기
    const paymentRequest = paymentRequests.get(orderId)

    if (paymentRequest) {
      // 결제 성공 시 후원자 정보 저장 (실제로는 데이터베이스에 저장)
      // 여기서는 API를 통해 저장합니다
      await fetch(`${BASE_URL}/api/supporters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: paymentRequest.customerName,
          amount: parseInt(amount),
          coffeeCount: paymentRequest.coffeeCount,
          message: paymentRequest.message,
        }),
      })

      // 결제 요청 정보 삭제
      paymentRequests.delete(orderId)
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('결제 승인 오류:', error)
    return NextResponse.json(
      { error: error.message || '결제 승인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
