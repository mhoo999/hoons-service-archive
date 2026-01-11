import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const repository = searchParams.get('repository')

    if (!repository) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      )
    }

    // GitHub URL 파싱
    const match = repository.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 }
      )
    }

    const owner = match[1]
    const repo = match[2].replace(/\.git$/, '')

    // GitHub API 호출 (서버 사이드에서 실행되므로 CORS 문제 없음)
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'hoons-service-archive',
          // GitHub Personal Access Token이 있으면 사용 (선택사항, rate limit 증가)
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    )

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'Failed to fetch commit date', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    if (!data || data.length === 0) {
      return NextResponse.json({ date: null })
    }

    return NextResponse.json({ date: data[0].commit.committer.date })
  } catch (error: any) {
    console.error('Error fetching GitHub commit date:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
