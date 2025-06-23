# CheatJudge 👀💻

온라인 코딩 테스트 중 부정행위 방지를 위한 다층 스크리닝 시스템

## 📝 프로젝트 요약

- **Cheat Judge**는 온라인 코딩 시험 중 부정행위를 감지하는 웹 IDE 프론트엔드입니다.
- 실시간 시선 추적(WebGazer.js), 창 전환 감지, 외부 복사/붙여넣기 방지, 코드 자동 수집 등 다양한 치팅 방지 기능을 제공합니다.

## 👥 팀원

- 임준현 (PM, AI)
- 유광준 (프론트엔드)
- 권용현 (백엔드)

## ⚡️ 주요 기능

- **CodeMirror** 기반 IDE 환경
- 복사/붙여넣기 등 외부 입력 차단
- 창 전환 및 시선 추적(WebGazer.js)  
- 실시간 코드 자동 저장/채점 연동
- 시험 중 얼굴 인식 및 중앙 응시 확인

## 🛠️ 주요 기술스택

- **프론트엔드:** React, Typescript, TailwindCSS, Shadcn/ui, CodeMirror
- **백엔드:** Spring Boot, Java, MySQL, Gradle
- **AI/분석:** WebGazer.js, n8n

## 🚀 사용법

### 1. 레포지토리 클론

```bash
git clone https://github.com/kommiter/cheatjudge-fe.git
cd cheatjudge-fe
```


### 2. 의존성 설치
```bash
pnpm install
```

### 3. 개발 서버 실행
```bash
pnpm dev
```

실행 후 브라우저에서
http://localhost:5173
로 접속하면 화면을 볼 수 있습니다.

### ⚙️ 추가 안내
#### 환경변수
- 별도 환경변수 필요 시 .env.example 참고해 .env 파일 생성
#### 백엔드 연동
- 채점, 유사도 분석 등 일부 기능은 백엔드 서버 필요
(백엔드가 꺼져있으면 코드 실행 등 동작 X)
#### 웹캠 권한
- WebGazer.js 기능 위해 브라우저에서 웹캠 허용 필요
