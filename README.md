# 사주담 AI 사주 상담 서비스

정확한 사주 명식 계산 + 명리학 지식베이스 + AI 상담 MVP

## 실행 방법

```bash
npm install
cp .env.example .env.local
# .env.local에 OPENAI_API_KEY 설정
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 주요 기능

- 사주 입력 (양력/음력, 윤달, 출생시간 미상)
- 만세력 기반 4주 명식 계산
- 오행·십신·지장간·합충·대운·세운 JSON
- 기본 사주 / 연애 / 성공운 상담
- 냉철한 분석가 / 공감형 상담가 AI 채팅

## 테스트

```bash
npm test
npm run build
```

## 아키텍처

```
입력 → /api/saju (계산 엔진) → SAJU JSON
     → /api/analyze (성향 카드)
     → /api/chat (지식 조회 + AI 상담)
```

AI는 사주를 계산하지 않으며, 계산된 JSON과 `knowledge/` 파일만 해석에 사용합니다.
