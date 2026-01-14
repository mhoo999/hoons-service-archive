import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// 페이앱 설정
const PAYAPP_USER_ID = process.env.PAYAPP_USER_ID || ''
const PAYAPP_LINK_KEY = process.env.PAYAPP_LINK_KEY || ''
const PAYAPP_LINK_VAL = process.env.PAYAPP_LINK_VAL || ''

/**
 * 페이앱 Feedback URL 웹훅
 * 결제 완료 시 페이앱 서버에서 이 엔드포인트로 POST 요청을 보냅니다.
 * HTTP 200 응답으로 'SUCCESS' 문자열을 반환해야 결제가 최종 승인됩니다.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[DEBUG] Feedback API 요청 수신 시작')
    
    // 페이앱에서 전송한 데이터 파싱
    const formData = await request.formData()
    
    // 모든 formData 키 확인
    const allKeys: string[] = []
    formData.forEach((value, key) => {
      allKeys.push(key)
    })
    console.log('[DEBUG] 받은 formData 키 목록:', allKeys)

    const userid = formData.get('userid') as string
    const linkkey = formData.get('linkkey') as string
    const linkval = formData.get('linkval') as string
    const pay_state = formData.get('pay_state') as string
    const mul_no = formData.get('mul_no') as string
    const price = formData.get('price') as string
    const goodname = formData.get('goodname') as string
    const var1 = formData.get('var1') as string // orderId
    const var2 = formData.get('var2') as string // customerName
    const var3 = formData.get('var3') as string // message (공식 지원 안됨, 확인용)

    console.log('[DEBUG] 페이앱 Feedback 수신 - 모든 데이터:', {
      userid,
      pay_state,
      mul_no,
      price,
      goodname,
      var1: var1 || '(없음)',
      var2: var2 || '(없음)',
      var3: var3 || '(없음)',
      'var2 길이': var2?.length || 0,
      'var3 길이': var3?.length || 0,
    })
    
    // paymentRequests에서 메시지 조회 (var1이 orderId)
    let message = null
    if (var1) {
      // paymentRequests는 메모리 저장소이므로 서버 재시작 시 사라질 수 있음
      // 하지만 Feedback이 즉시 호출되면 접근 가능
      const paymentRequest = (global as any).paymentRequests?.get?.(var1)
      if (paymentRequest) {
        message = paymentRequest.message
        console.log('[DEBUG] paymentRequests에서 메시지 조회:', message)
      }
    }

    // 1. 인증 검증
    if (userid !== PAYAPP_USER_ID || linkkey !== PAYAPP_LINK_KEY || linkval !== PAYAPP_LINK_VAL) {
      console.error('페이앱 인증 실패:', { userid, linkkey, linkval })
      return new NextResponse('FAIL - Authentication failed', { status: 401 })
    }

    // 2. 결제 상태 확인 (4 = 결제 완료)
    if (pay_state !== '4') {
      console.log('결제 미완료 상태:', pay_state)
      return new NextResponse('SUCCESS', { status: 200 })
    }

    // 3. 후원자 정보 저장
    try {
      console.log('[DEBUG] Supabase 클라이언트 생성 시작')
      console.log('[DEBUG] 환경 변수 확인:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      })
      const supabase = createServerClient()
      console.log('[DEBUG] Supabase 클라이언트 생성 완료')

      // 커피 개수 계산 (5000원당 1잔)
      const amount = parseInt(price)
      const coffeeCount = Math.floor(amount / 5000)
      console.log('[DEBUG] 계산된 값:', { amount, coffeeCount, mul_no, name: var2, message })

      // 중복 방지: mul_no로 이미 저장된 결제인지 확인
      console.log('[DEBUG] 중복 체크 시작 - mul_no:', mul_no)
      const { data: existing, error: checkError } = await supabase
        .from('supporters')
        .select('id, mul_no')
        .eq('mul_no', mul_no)
        .single()

      console.log('[DEBUG] 중복 체크 결과:', { existing, checkError })

      if (existing) {
        console.log('[DEBUG] 이미 처리된 결제:', mul_no)
        return new NextResponse('SUCCESS', { status: 200 })
      }

      // 새 후원자 정보 저장 (id는 UUID로 자동 생성, mul_no는 별도 컬럼으로 저장)
      const insertData = {
        mul_no: mul_no, // 페이앱 결제 번호를 별도 컬럼으로 저장
        name: var2 || '익명',
        amount,
        coffee_count: coffeeCount,
        message: message?.trim() || null, // 메시지 저장 (paymentRequests에서 조회)
      }
      console.log('[DEBUG] 저장할 데이터:', insertData)

      const { data: insertedData, error } = await supabase
        .from('supporters')
        .insert(insertData)
        .select()

      console.log('[DEBUG] Insert 결과:', { insertedData, error })

      if (error) {
        console.error('[ERROR] Supabase 저장 오류 상세:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        // 데이터베이스 오류가 있어도 페이앱에게는 SUCCESS를 반환
        // (결제는 완료되었으므로)
        return new NextResponse('SUCCESS', { status: 200 })
      }

      console.log('[SUCCESS] 후원자 정보 저장 완료:', { mul_no, name: var2, amount, insertedData })

      // 페이앱에게 성공 응답 (필수!)
      return new NextResponse('SUCCESS', { status: 200 })

    } catch (dbError: any) {
      console.error('[ERROR] 데이터베이스 처리 오류 상세:', {
        message: dbError?.message,
        stack: dbError?.stack,
        error: dbError,
      })
      // 데이터베이스 오류가 있어도 페이앱에게는 SUCCESS를 반환
      return new NextResponse('SUCCESS', { status: 200 })
    }

  } catch (error: any) {
    console.error('[ERROR] Feedback 처리 오류 상세:', {
      message: error?.message,
      stack: error?.stack,
      error: error,
    })
    // 오류가 발생해도 페이앱에게는 FAIL을 반환하지 않음
    // (이미 결제가 완료된 상태일 수 있으므로)
    return new NextResponse('SUCCESS', { status: 200 })
  }
}

// GET 요청: Feedback URL 접근 가능 여부 테스트용
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Feedback URL is accessible',
      timestamp: new Date().toISOString(),
      note: 'This endpoint should receive POST requests from PayApp when payment is completed'
    },
    { status: 200 }
  )
}
