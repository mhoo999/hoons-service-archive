-- mul_no 컬럼 추가 마이그레이션
-- 기존 테이블에 mul_no 컬럼을 추가합니다.

-- mul_no 컬럼 추가 (NULL 허용, 기존 데이터는 NULL)
ALTER TABLE supporters 
ADD COLUMN IF NOT EXISTS mul_no TEXT;

-- mul_no에 UNIQUE 제약 조건 추가
CREATE UNIQUE INDEX IF NOT EXISTS idx_supporters_mul_no_unique 
ON supporters(mul_no) 
WHERE mul_no IS NOT NULL;

-- mul_no 인덱스 생성 (중복 체크 최적화)
CREATE INDEX IF NOT EXISTS idx_supporters_mul_no 
ON supporters(mul_no);
