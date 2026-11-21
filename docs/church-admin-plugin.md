# 모현소망교회 관리자 전용 ChatGPT 연결 — 1단계

상태: **설계 및 읽기 전용 API 프로토타입**. ChatGPT 플러그인 설치·인증·운영 배포는 아직 하지 않았습니다.

## 현재 구조
- 공개 홈페이지: GitHub Pages (`mohyeonsomang.org`)
- 콘텐츠 원본: `content/news.json`, `content/sermons.json`, `content/sunday-school.json`, `content/sarangbang-sharing.json`
- 기존 편집기: `admin.html` + GitHub Contents API
- 새 관리자 연결: 별도 HTTPS 백엔드 (GitHub Pages에는 비밀키 저장 금지)

## 목표 구조
ChatGPT 관리자 플러그인 → OAuth 인증 → HTTPS 관리 API → 역할/작업 검증 → GitHub Contents API(게시물) / 추후 DB(교적·출석)
                                                       ↘ 감사 로그

## 단계
1. **현재 단계**: 게시물 목록/조회용 읽기 전용 API 스펙과 로컬 실행 프로토타입 준비.
2. 관리자 인증: OAuth 로그인, 허용 계정 목록, 역할 권한, API 서버의 토큰 검증.
3. 변경 작업: `create_post`, `update_post`, `delete_post` 구현. 변경 전 미리보기 및 명시적 확인, SHA 충돌 검사, 작업 기록 필수.
4. ChatGPT 연결: 플랫폼에서 지원하는 플러그인/도구 인터페이스와 인증 설정 후 비공개 테스트.
5. 사역관리: 별도 DB에 성도 개인정보 저장, 최소 권한/RLS, 감사 로그 및 백업.

## 안전 원칙
- GitHub 토큰, DB 서비스 키를 프런트엔드·저장소·ChatGPT 대화에 넣지 않음.
- 공개 게시물 조회와 교적·출석·심방 등의 개인정보 API는 분리.
- 삭제/게시/대량 수정은 권한 확인과 사용자 승인 필요.
- 원본 데이터 스키마를 그대로 유지해 기존 홈페이지 및 편집기를 깨뜨리지 않음.

## 프로토타입 실행
Node.js 20 이상에서 `node tools/church-admin-api/server.mjs`
- `GET http://localhost:8787/health`
- `GET http://localhost:8787/v1/posts?board=sermons`
- `GET http://localhost:8787/v1/posts?board=school`
- 이 서버는 **로컬 테스트용 공개 게시물 조회만 지원**하며 관리자 인증 또는 쓰기 기능은 제공하지 않습니다.
- 외부에서 접근 가능한 서버에 그대로 배포하지 마세요.

## 다음 단계에 필요한 결정
- 관리자 로그인 제공자(OAuth) 및 운영 백엔드 호스팅
- 기존 GitHub JSON을 계속 원본으로 사용할지 여부
- 초기 관리 범위(교회소식/설교/주일학교/사랑방)
