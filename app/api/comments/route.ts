import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const supabase = createServerClient()

    // 전체 개수 조회
    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })

    // 페이지네이션으로 데이터 조회 (최신순 정렬)
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      throw error
    }

    const hasMore = (count || 0) > to + 1

    // 데이터 형식 변환 (snake_case -> camelCase)
    const comments = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      message: item.message,
      createdAt: item.created_at,
    }))

    return NextResponse.json({
      comments,
      hasMore,
      total: count || 0
    })
  } catch (error: any) {
    console.error('댓글 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '댓글 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, message } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: '이름과 댓글을 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('comments')
      .insert({
        name,
        message,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // 응답 형식 변환 (snake_case -> camelCase)
    const newComment = {
      id: data.id,
      name: data.name,
      message: data.message,
      createdAt: data.created_at,
    }

    return NextResponse.json({ success: true, data: newComment }, { status: 201 })
  } catch (error: any) {
    console.error('댓글 추가 오류:', error)
    return NextResponse.json(
      { error: error.message || '댓글을 저장하는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
