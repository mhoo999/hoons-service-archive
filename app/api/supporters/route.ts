import { NextResponse } from 'next/server'

// 임시 데이터 저장소 (실제로는 데이터베이스 사용 권장)
// 이 예제에서는 메모리 저장소 사용
// 실제 프로덕션에서는 데이터베이스(예: PostgreSQL, MongoDB)를 사용하세요

let supporters: any[] = [
  // 샘플 데이터 (실제로는 데이터베이스에서 가져옵니다)
  // {
  //   id: 'supporter-1',
  //   name: '홍길동',
  //   amount: 10000,
  //   coffeeCount: 2,
  //   message: '응원합니다!',
  //   createdAt: new Date().toISOString(),
  // },
]

export async function GET() {
  try {
    // 최신순으로 정렬
    const sortedSupporters = [...supporters].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(sortedSupporters)
  } catch (error: any) {
    console.error('후원자 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '후원자 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, amount, coffeeCount, message } = body

    const newSupporter = {
      id: `supporter-${Date.now()}`,
      name,
      amount,
      coffeeCount,
      message: message || '',
      createdAt: new Date().toISOString(),
    }

    supporters.push(newSupporter)

    return NextResponse.json({ success: true, data: newSupporter }, { status: 201 })
  } catch (error: any) {
    console.error('후원자 추가 오류:', error)
    return NextResponse.json(
      { error: '후원자 정보를 저장하는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
