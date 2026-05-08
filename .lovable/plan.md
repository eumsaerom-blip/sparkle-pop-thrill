## 목표
업로드한 `unboxing-master.html` 게임에 4가지 'Juice' 효과를 추가하고, Lovable 프로젝트에서 바로 플레이할 수 있게 연결합니다.

## 프로젝트 연결 방식
현재 프로젝트는 빈 placeholder 상태이므로, 게임 HTML은 단일 파일로 유지하고 다음과 같이 통합합니다:

1. `user-uploads://unboxing-master.html` → `public/game/index.html` 로 복사
2. `src/routes/index.tsx` 를 게임을 전체 화면 `<iframe>` 으로 보여주는 랜딩으로 교체 (SEO 메타태그 포함, 한글 제목/설명)

이 방식으로 게임의 기존 단일 파일 구조(전역 상태, 인라인 스타일, Web Audio)를 그대로 유지하면서 Lovable 미리보기에서 바로 동작합니다.

## 추가할 4가지 연출

### 1. 파티클 효과 (배치 시 반짝임)
- `onCellClick` 의 배치 성공 분기에서, 배치된 각 셀 중심 좌표를 기준으로 파티클 8~12개 분출
- 별(`★`) / 꽃가루(원형 색상 점) 두 종류를 무작위로 섞어 사용
- 구현: `position: fixed` 컨테이너 `#fx-layer` 에 짧은 수명(600~900ms)의 div를 생성, CSS `@keyframes burst` 로 랜덤 각도/거리로 튀어나간 뒤 페이드아웃
- 색상은 배치한 아이템의 `color.dk` + 흰색 하이라이트 사용해 통일감 부여

### 2. 상자 언박싱 연출 (뚜껑 열림 + 아이템 튀어나옴)
- 현재 `pickBox`(상자 클릭 시) 흐름을 비동기 연출로 확장
- 상자 DOM에 `.unboxing` 클래스 추가 → CSS로:
  - 뚜껑(상자 위쪽 ½)을 `transform-origin: top` 으로 회전(-110deg) + 살짝 위로 튀어오름
  - 안쪽에서 아이템 미니 프리뷰가 `scale(0) → scale(1.15) → scale(1)` 로 튀어나오며 위로 80~100px 이동 후 사라짐
- 약 350ms 후 기존처럼 상자 제거 + `currentItem` 설정 + 손에 든 아이템 패널 갱신
- 클릭 직후 입력 차단(짧은 lock)으로 더블클릭 꼬임 방지

### 3. 압박감 Vignette (≥ 80%)
- `body` 위에 `position: fixed; inset: 0; pointer-events: none;` 인 `#vignette` 오버레이 추가
- `box-shadow: inset 0 0 120px 40px rgba(220,40,40,.55)` + radial gradient 로 테두리 붉은 광원
- 임계값: `CONFIG.PRESSURE_CRIT` (80) 이상일 때 `.active` 토글 → CSS `@keyframes pulse` 로 opacity 0.35 ↔ 1 깜빡임 (약 0.9s 주기)
- `recalcPressure()` 마지막에 토글 로직 호출하여 실시간 반응

### 4. 콤보 알림 (중앙 큰 텍스트)
- 기존 `spawnCombo(combo)` 를 확장 (또는 옆에 신규 `spawnComboBanner` 추가)
- 기준:
  - 3 콤보 → "Great!"
  - 5 콤보 → "Perfect!"
  - 7+ 콤보 → "Amazing!"
- 화면 정중앙에 크게(폰트 ~64px, 900 weight) 표시, 색상은 단계별로 (Great=오렌지, Perfect=핑크, Amazing=골드 그라디언트 + 텍스트 글로우)
- 애니메이션: `scale(0.4) → 1.15 → 1.0` 진입(180ms) → 350ms 유지 → `scale(1) → 1.4 + opacity 0` 페이드아웃(380ms)
- 중복 방지: 표시 중이면 기존 노드 제거 후 새로 띄움

## 기술 메모
- 모든 신규 DOM 효과는 `#fx-layer` 단일 컨테이너에 모아 z-index/cleanup 단순화
- 파티클/콤보는 `setTimeout` 으로 자동 제거 (메모리 누수 방지)
- 추가 코드는 기존 파일 하단의 새로운 `/* ===== JUICE FX ===== */` 섹션과 `<style>` 내 별도 블록에 격리해 가독성 유지
- React 측은 단순 iframe 래퍼만 추가 — 게임 로직은 손대지 않음

## 변경/생성 파일
- `public/game/index.html` (신규, 업로드 HTML + 4가지 연출 패치)
- `src/routes/index.tsx` (게임 iframe + 메타태그)
