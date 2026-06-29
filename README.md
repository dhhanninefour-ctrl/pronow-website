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

## 3. 인터넷에 공개하기 — Vercel (무료)

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
