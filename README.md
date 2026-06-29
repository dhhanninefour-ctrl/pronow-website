# PRONOW 회사 홈페이지

프로나우(PRONOW) — 테니스 선수 전문 에이전시 / 스포츠 마케팅 회사 공식 홈페이지.
의존성 없는 **정적(static) HTML/CSS/JS** 한 페이지 사이트입니다. 빌드가 필요 없습니다.

- 디자인: 다크 그레이 + 오렌지 (회사소개서 톤)
- 언어: 한국어 / English 토글 (우측 상단 KO | EN)
- 문의: 연락처 표시 (이메일·전화·주소·SNS)

---

## 1. 미리보기 (내 컴퓨터에서 바로 보기)

`index.html` 파일을 더블클릭해서 브라우저로 열면 끝입니다.

> 일부 브라우저는 보안상 로컬 파일에서 사진을 못 불러올 수 있습니다.
> 그럴 땐 아래 "로컬 서버"로 열면 확실합니다 (Node 설치 후):
> ```bash
> npx serve .
> ```

---

## 2. 사진 넣기

`assets/images/` 폴더에 정해진 파일 이름으로 사진을 저장하면 자동 표시됩니다.
자세한 파일 이름은 **`assets/images/README.txt`** 를 참고하세요.
(사진이 없으면 회색 자리표시 박스가 보이며, 이는 정상입니다.)

---

## ✅ 현재 배포 상태 (이미 라이브)

- **라이브 주소:** https://pronowsportsagency.vercel.app/
- **GitHub 저장소:** https://github.com/dhhanninefour-ctrl/pronow-website
- **Vercel 프로젝트:** `pronow-website`
- **자동 배포:** 이 저장소에 `git push` 하면 **Vercel이 자동으로 빌드·배포**합니다.
  즉, 코드를 수정하고 push만 하면 위 주소가 자동으로 갱신됩니다.

### 코드 수정 후 반영하는 법
```bash
git add .
git commit -m "수정 내용"
git push
```
→ 잠시 뒤 라이브 주소(https://pronowsportsagency.vercel.app/)에 자동 반영.

---

## 🖥️ 다른 컴퓨터에서 이어서 작업하기

이 프로젝트의 모든 것은 **클라우드(GitHub + Vercel)** 에 있습니다. 어느 컴퓨터에서든 이어갈 수 있어요.
(주의: AI 대화 기록은 컴퓨터 간 자동 이전되지 않습니다. 하지만 이 README와 코드를 보면 맥락 파악이 됩니다.)

### 핵심 정보 (북마크 해두세요)
- 라이브 사이트: **https://pronowsportsagency.vercel.app/**
- GitHub 저장소: **https://github.com/dhhanninefour-ctrl/pronow-website**
- Vercel 프로젝트: `pronow-website` (도메인 `pronowsportsagency.vercel.app`)
- 계정: GitHub `dhhanninefour-ctrl` / Vercel·Claude `dhhanninefour@gmail.com`

### 방법 A — 설치 없이 (가장 간단)
1. 새 컴퓨터 브라우저에서 GitHub 로그인
2. 위 GitHub 저장소에서 파일을 직접 수정 → 저장(Commit)
3. → Vercel이 자동 배포. 끝.

### 방법 B — 컴퓨터에 제대로 세팅
1. **Git 설치** → https://git-scm.com (첫 push 때 GitHub 로그인 창 뜨면 승인)
2. **저장소 내려받기:**
   ```bash
   git clone https://github.com/dhhanninefour-ctrl/pronow-website.git
   ```
3. (선택) **Node.js 설치** → 로컬 미리보기(`npx serve .`)나 이미지 작업 시
4. 수정 후 반영:
   ```bash
   git add .
   git commit -m "메모"
   git push
   ```
5. (선택) **Claude Code 설치** 후 `claude.ai` 계정(Max)으로 로그인 → 이 폴더에서 "이건 PRONOW 회사 홈페이지야"라고 말하면 README·코드를 읽고 이어서 도와줍니다.

> 새 컴퓨터든 이 컴퓨터든, 앞으로 "프로젝트 설정"은 다시 할 필요 없습니다. **수정 → push → 자동 배포** 뿐입니다.

---

## 3. (참고) Vercel CLI로 직접 배포하는 방법

> 위 GitHub 자동 배포가 이미 동작하므로 보통 이 방법은 필요 없습니다. 참고용입니다.
처음 한 번만 아래 순서대로 진행하면, 이후에는 명령 한 줄로 갱신됩니다.
**비개발자 기준 단계별 안내입니다.**

### (1) Node.js 설치 — 최초 1회
Vercel 도구가 Node.js를 필요로 합니다. Windows 터미널(PowerShell)에서:
```powershell
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
```
- 설치 중 "이 앱이 변경하도록 허용?" 창이 뜨면 **예** 를 누르세요.
- 설치가 끝나면 터미널을 **새로 열고** 아래로 확인:
```powershell
node -v
npm -v
```
버전 숫자가 보이면 성공입니다.

### (2) Vercel 도구 설치 — 최초 1회
```powershell
npm i -g vercel
```

### (3) 로그인 (브라우저)
```powershell
vercel login
```
- 이메일을 입력하거나 GitHub로 로그인 → **브라우저가 열리면 "Confirm"** 을 누르세요.
- (이미 Vercel·GitHub 가입이 되어 있으므로 클릭만 하면 됩니다.)

### (4) 배포
이 프로젝트 폴더 안에서:
```powershell
cd "C:\Users\EM00001063\OneDrive - MISTO\바탕 화면\claude_ai\pronow_website"
vercel
```
- 질문이 나오면 대부분 **Enter(기본값)** 로 넘어가면 됩니다.
  - "Set up and deploy?" → **Y**
  - "Which scope?" → 본인 계정 선택(Enter)
  - "Link to existing project?" → **N**
  - "Project name?" → `pronow` (Enter)
  - "In which directory is your code?" → `./` (Enter)
- 미리보기 주소가 나옵니다.

운영(정식) 공개:
```powershell
vercel --prod
```
→ `https://pronow.vercel.app` 같은 **무료 주소**가 발급됩니다. 이 주소를 공유하면 됩니다.

이후 사이트를 수정한 뒤에는 `vercel --prod` 한 줄이면 갱신됩니다.

---

## 4. 나중에 `www.회사도메인.com` 연결하기

1. 도메인을 직접 구매합니다 (예: 가비아, Cloudflare, GoDaddy 등 — 연 1~2만원대).
   > 결제는 직접 진행해야 합니다.
2. Vercel 대시보드 → 해당 Project → **Settings → Domains** → 도메인 입력 후 추가.
3. Vercel이 알려주는 DNS 레코드(CNAME/A)를 도메인 구매처 관리 화면에 입력.
4. 잠시 후 자동 연결됩니다. 정적 사이트라 주소만 바뀌고 내용은 그대로입니다.

---

## 5. (선택) GitHub로 버전 관리 + 자동 배포

```powershell
git init
git add .
git commit -m "PRONOW website"
```
GitHub에 새 저장소를 만든 뒤 push하고, Vercel에서 그 저장소를 Import하면
앞으로 코드를 push할 때마다 자동으로 사이트가 갱신됩니다.

---

## 파일 구조
```
index.html              전체 페이지
css/styles.css          디자인(다크+오렌지) · 반응형
js/i18n.js              한국어/영어 번역 + 토글
js/main.js              메뉴 · 스크롤 효과 · 사진 자동 로딩
assets/images/          사진 넣는 폴더 (README.txt 참고)
```

## 연락처/정보 수정 위치
- 글자(한/영) 수정: `js/i18n.js` 의 `ko` / `en` 사전
- 이메일·전화·SNS 링크: `index.html` 의 Contact / Footer 영역
