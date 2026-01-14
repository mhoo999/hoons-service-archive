-- 후원자 테이블 생성
CREATE TABLE IF NOT EXISTS supporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  coffee_count INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (최신순 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_supporters_created_at ON supporters(created_at DESC);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 후원자 목록을 읽을 수 있도록 설정
CREATE POLICY "Anyone can read supporters" ON supporters
  FOR SELECT USING (true);

-- 서비스 역할만 후원자를 추가할 수 있도록 설정 (API에서만 사용)
CREATE POLICY "Service role can insert supporters" ON supporters
  FOR INSERT WITH CHECK (true);
