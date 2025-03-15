import { useRouteError } from 'react-router'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '@/components/ui/button.tsx'

export default function Error({ isRootError }: { isRootError?: boolean }) {
  const error = useRouteError() as Error
  const { reset } = useQueryErrorResetBoundary()

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-center text-lg font-semibold mb-3">
        오류가 발생했습니다.
      </h2>

      {isRootError && <p className="mb-3">{error.message}</p>}

      <Button
        onClick={() => {
          reset()
          window.location.reload()
        }}
      >
        새로고침하기
      </Button>
    </main>
  )
}
