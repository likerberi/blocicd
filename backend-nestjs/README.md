# Backend NestJS Skeleton

## 개요
- 목적: 제안형 채용 플랫폼 MVP 백엔드 스캐폴딩
- 범위: JWT 인증/권한, 제안 생성/수락/거절, 채팅 게이트웨이, 최종 합격 처리 상태 전이, Prisma 스키마

## 폴더
- `src/main.ts`: 앱 부트스트랩
- `src/app.module.ts`: 모듈 등록
- `src/modules/auth/*`: 회원가입/로그인 + JWT 발급
- `src/modules/proposals/*`: 제안 API/비즈니스 로직
- `src/modules/chat/chat.gateway.ts`: 채팅 WebSocket 이벤트
- `src/modules/hires/hires.controller.ts`: 최종 합격 처리
- `migrations/0001_init.sql`: 초기 DB 스키마
- `prisma/schema.prisma`: Prisma 데이터 모델

## 실행
```bash
npm install
npm run prisma:generate
npm run start:dev
```

`.env.example`를 복사해 `.env`를 생성하고 `JWT_SECRET`, `DATABASE_URL`를 설정합니다.

## 핵심 정책 반영
- 제안 `PENDING` 상태에서만 수락/거절 가능
- 수락 후 채팅방 개설 트리거
- `CHATTING` 상태에서만 최종 합격 가능
- 최종 합격 시 연락처 공개/감사로그 기록 트리거
- 역할별 접근 제어
  - 기업: 제안 발송/최종 합격
  - 구직자: 제안 수락/거절

## 현재 구현 상태
- 제안 도메인: Prisma(PostgreSQL) 기반으로 동작
- 인증 도메인: Prisma(PostgreSQL) 기반으로 동작
- 인증 보안: `bcrypt` 비밀번호 해시, refresh token hash 저장/회전, 로그아웃 무효화 적용
- 감사 추적: 상태 전이(`proposal_status_logs`) 및 개인정보 공개(`pii_access_logs`) 기록 연동

## 코드 주석 원칙
- 주석은 의도/제약/부작용처럼 코드만으로 바로 드러나지 않는 정보만 설명
- 자명한 변수 대입/단순 흐름 설명 주석은 작성하지 않음
- 새로운 개념/라이브러리 도입 시 첫 사용 지점에 1줄 설명 추가
