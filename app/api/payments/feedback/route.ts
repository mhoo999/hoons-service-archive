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
    // 페이앱에서 전송한 데이터 파싱
    const formData = await request.formData()

    const userid = formData.get('userid') as string
    const linkkey = formData.get('linkkey') as string
    const linkval = formData.get('linkval') as string
    const pay_state = formData.get('pay_state') as string
    const mul_no = formData.get('mul_no') as string
    const price = formData.get('price') as string
    const goodname = formData.get('goodname') as string
    const var1 = formData.get('var1') as string // orderId
    const var2 = formData.get('var2') as string // customerName

    console.log('페이앱 Feedback 수신:', {
      userid,
      pay_state,
      mul_no,
      price,
      goodname,
      var1,
      var2,
    })

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
      const supabase = createServerClient()

      // 커피 개수 계산 (5000원당 1잔)
      const amount = parseInt(price)
      const coffeeCount = Math.floor(amount / 5000)

      // 중복 방지: mul_no로 이미 저장된 결제인지 확인
      const { data: existing } = await supabase
        .from('supporters')
        .select('id')
        .eq('mul_no', mul_no)
        .single()

      if (existing) {
        console.log('이미 처리된 결제:', mul_no)
        return new NextResponse('SUCCESS', { status: 200 })
      }

      // 새 후원자 정보 저장 (id는 UUID로 자동 생성, mul_no는 별도 컬럼으로 저장)
      const { error } = await supabase
        .from('supporters')
        .insert({
          mul_no: mul_no, // 페이앱 결제 번호를 별도 컬럼으로 저장
          name: var2 || '익명',
          amount,
          coffee_count: coffeeCount,
          message: null, // 메시지는 결제 폼에서 별도로 받을 수 있음
        })

      if (error) {
        console.error('Supabase 저장 오류:', error)
        // 데이터베이스 오류가 있어도 페이앱에게는 SUCCESS를 반환
        // (결제는 완료되었으므로)
        return new NextResponse('SUCCESS', { status: 200 })
      }

      console.log('후원자 정보 저장 완료:', { mul_no, name: var2, amount })

      // 페이앱에게 성공 응답 (필수!)
      return new NextResponse('SUCCESS', { status: 200 })

    } catch (dbError) {
      console.error('데이터베이스 처리 오류:', dbError)
      // 데이터베이스 오류가 있어도 페이앱에게는 SUCCESS를 반환
      return new NextResponse('SUCCESS', { status: 200 })
    }

  } catch (error: any) {
    console.error('Feedback 처리 오류:', error)
    // 오류가 발생해도 페이앱에게는 FAIL을 반환하지 않음
    // (이미 결제가 완료된 상태일 수 있으므로)
    return new NextResponse('SUCCESS', { status: 200 })
  }
}

// GET 요청은 지원하지 않음
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
