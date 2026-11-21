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


## 2단계 로컬 관리 API (2026-11-22)
- `tools/church-admin-api/server.mjs`에 서버 전용 Bearer 키 확인, GitHub 저장소 읽기/쓰기, 변경 미리보기, 5분 만료 승인, SHA 충돌 방지, 로컬 감사 로그 추가.
- **현재 인증은 OAuth가 아니라 로컬 스테이징용 공유 비밀키 방식이다.** 실제 ChatGPT 플러그인 연결 및 외부 배포 금지. OAuth, 사용자별 역할, rate limit, 영구 감사 로그, 보안 검토가 먼저 필요하다.
- 서버는 127.0.0.1:8787에만 바인딩. 환경변수 `CHURCH_ADMIN_API_KEY` (무작위 32자 이상), `CHURCH_GITHUB_TOKEN` (최소 권한 contents write)가 없으면 쓰기 비활성화.
- `GET /v1/posts?board=news|sermons|school|sharing` 공개 게시물 로컬 조회.
- `POST /v1/changes/preview?board=...` 관리자 인증 필수. JSON body 예: `{"operation":"delete","index":0}` 또는 `{"operation":"create","post":{"date":"2026.11.22","title":"예시"}}`.
- `POST /v1/changes/commit?board=...` 관리자 인증 필수. JSON body: `{"draftId":"미리보기 응답 ID","confirm":true}`.
- 임시 게시물 식별은 배열 인덱스에 의존한다. SHA 재확인으로 동시 수정 덮어쓰기는 막지만, 운영 단계에서는 안정적인 게시물 ID를 추가해야 한다.
- 로컬 실행 전 Node.js 20 이상과 환경변수를 준비하고, 비밀키를 저장소에 올리지 않는다.
- **실제 실행·요청 테스트와 ChatGPT 플러그인 연결은 아직 완료되지 않았다.**


## 3단계 — Primary 프로젝트 확인 및 인증 배포 보류 (2026-11-22)

- Supabase Primary 계정에서 프로젝트 `mohyeon-workhub` (`oxlqmxjghelcfskloqkw`, ap-south-1, ACTIVE_HEALTHY)을 확인함.
- 기존 WORKHUB의 DB 구조를 확인하는 `list_tables` 요청이 데이터베이스 연결 시간 초과로 2회 실패함.
- 기존 데이터 보호를 위해 **DDL, 관리자 계정 생성, RLS 정책 변경, Edge Function 배포는 실행하지 않음**.
- 추천: 기존 프로젝트 내 별도 비공개 `church_plugin` 스키마로 권한/감사 로그를 분리하되, 실제 적용 전 기존 테이블 및 인증 정책을 읽기 전용으로 확인할 것.
- 권한 모델: 관리자 명단은 서버/DB의 신뢰할 수 있는 레코드로 관리하며 `user_metadata`로 권한을 판단하지 않음. 게시물 변경은 별도 API에서 인증·역할·명시적 승인·SHA 충돌 검사 수행.
- 외부 ChatGPT 플러그인에 기존 로컬 API를 직접 연결하지 말 것. 기존 API는 로컬 공유키 테스트 코드이며 운영 인증이 아님.
- 후속: DB 연결 복구 → 기존 Auth/테이블 확인 → 격리된 관리자 권한 테이블과 RLS 설계 → API의 검증된 OAuth/OIDC 토큰 검증 → 감사 로그/배포/통합 테스트.
