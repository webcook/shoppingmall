# Vercel 배포 가이드

이 문서는 쇼핑몰 프로젝트를 Vercel에 배포하는 방법을 안내합니다.

## 배포 전 확인사항

### 1. 빌드 테스트
```bash
npm run build
```
빌드가 성공적으로 완료되는지 확인하세요.

### 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

#### 필수 환경 변수
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase Anonymous Key

#### 환경 변수 설정 방법
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. Settings > Environment Variables 이동
4. 다음 변수들을 추가:
   - `VITE_SUPABASE_URL`: `https://uwxxvsbkksmlpkfiukto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: Supabase 대시보드에서 확인한 anon key

## 배포 방법

### 방법 1: Vercel CLI 사용
```bash
# Vercel CLI 설치 (전역)
npm i -g vercel

# 프로젝트 디렉토리에서 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 2: GitHub 연동
1. GitHub에 프로젝트 푸시
2. Vercel 대시보드에서 "New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정
5. "Deploy" 클릭

### 방법 3: Vercel 대시보드에서 직접 배포
1. Vercel 대시보드 접속
2. "Add New Project" 클릭
3. Git 저장소 연결 또는 파일 업로드
4. 환경 변수 설정
5. "Deploy" 클릭

## 배포 후 확인사항

### 1. 라우팅 확인
- React Router를 사용하므로 모든 경로가 `/index.html`로 리다이렉트되어야 합니다.
- `vercel.json`에 rewrites 설정이 포함되어 있습니다.

### 2. 환경 변수 확인
- 브라우저 콘솔에서 환경 변수가 제대로 로드되는지 확인
- Supabase 연결이 정상적으로 작동하는지 확인

### 3. 기능 테스트
- 회원가입/로그인 기능
- 네비게이션 바
- 히어로 섹션 슬라이더

## 문제 해결

### 빌드 실패
- TypeScript 오류 확인: `npm run build` 로컬에서 실행
- 의존성 문제: `npm install` 재실행

### 환경 변수 미적용
- Vercel 대시보드에서 환경 변수 재설정
- 배포 재실행

### 라우팅 오류
- `vercel.json`의 rewrites 설정 확인
- 모든 경로가 `/index.html`로 리다이렉트되는지 확인

## 참고사항

- Vercel은 자동으로 빌드 및 배포를 수행합니다
- Git에 푸시할 때마다 자동으로 재배포됩니다 (프로덕션 브랜치)
- Preview 배포는 모든 브랜치의 PR에 대해 생성됩니다

