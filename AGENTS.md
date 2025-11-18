# AGENTS.md - 프로젝트 개발 가이드

이 문서는 이 프로젝트에서 AI 에이전트가 따라야 할 개발 규칙과 가이드라인을 정의합니다.

## 핵심 원칙

### 1. shadcn/ui 우선 활용

- **모든 UI 컴포넌트는 shadcn/ui를 우선적으로 사용합니다.**
- 새로운 UI 컴포넌트가 필요할 때는 먼저 [shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components)에서 적합한 컴포넌트를 확인합니다.
- 기존 컴포넌트로 해결할 수 없는 경우에만 커스텀 컴포넌트를 작성합니다.

### 2. shadcn/ui 컴포넌트 추가 방법

**터미널 명령어를 통해서만 컴포넌트를 추가합니다.**

```bash
# 기본 컴포넌트 추가 명령어
npx shadcn@latest add [component-name]

# 예시
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

**중요 규칙:**
- ❌ 직접 컴포넌트 파일을 생성하지 않습니다.
- ❌ 다른 프로젝트에서 컴포넌트를 복사하지 않습니다.
- ✅ 반드시 `npx shadcn@latest add` 명령어를 사용합니다.
- ✅ 여러 컴포넌트를 한 번에 추가할 수 있습니다: `npx shadcn@latest add button card input`

### 3. 디자인 및 레이아웃 설계

- **shadcn/ui의 "new-york" 스타일을 기본으로 사용합니다.**
- 모든 레이아웃과 디자인은 shadcn/ui 컴포넌트를 조합하여 구성합니다.
- Tailwind CSS를 활용한 스타일링을 shadcn/ui 컴포넌트와 함께 사용합니다.
- 일관된 디자인 시스템을 유지하기 위해 shadcn/ui의 기본 스타일을 최대한 활용합니다.

### 4. 프로젝트 구조

```
src/
├── components/
│   ├── ui/          # shadcn/ui 컴포넌트 (터미널 명령어로만 추가)
│   └── ...          # 커스텀 컴포넌트
├── lib/
│   └── utils.ts     # 유틸리티 함수 (cn 함수 포함)
└── ...
```

### 5. 컴포넌트 사용 예시

```tsx
// ✅ 올바른 방법: shadcn/ui 컴포넌트 import
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>제목</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>클릭</Button>
      </CardContent>
    </Card>
  )
}
```

### 6. 작업 흐름

새로운 UI 기능을 추가할 때:

1. **필요한 컴포넌트 확인**: shadcn/ui 문서에서 필요한 컴포넌트 확인
2. **컴포넌트 추가**: `npx shadcn@latest add [component-name]` 명령어 실행
3. **컴포넌트 사용**: 추가된 컴포넌트를 import하여 사용
4. **스타일링**: Tailwind CSS 클래스를 통해 필요한 스타일 조정

### 7. 현재 프로젝트 설정

- **스타일**: new-york
- **TypeScript**: 활성화
- **아이콘 라이브러리**: lucide-react
- **CSS 변수**: 활성화
- **기본 색상**: neutral

### 8. 주의사항

- shadcn/ui 컴포넌트는 `src/components/ui/` 디렉토리에 자동으로 생성됩니다.
- 컴포넌트를 수정할 때는 원본 파일을 직접 수정해도 되지만, 업데이트 시 덮어씌워질 수 있습니다.
- 커스터마이징이 필요한 경우, shadcn/ui 컴포넌트를 기반으로 새로운 래퍼 컴포넌트를 만드는 것을 권장합니다.

## 요약

1. ✅ **shadcn/ui를 적극 활용** - 모든 UI는 shadcn/ui 컴포넌트로 구성
2. ✅ **터미널 명령어로만 컴포넌트 추가** - `npx shadcn@latest add [component-name]`
3. ✅ **일관된 디자인 시스템 유지** - new-york 스타일 기반
4. ✅ **Tailwind CSS 활용** - shadcn/ui와 함께 사용

