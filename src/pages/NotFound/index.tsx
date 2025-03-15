import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button.tsx'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-center text-lg font-semibold mb-3">
        요청하신 페이지를 찾을 수 없습니다.
      </h2>

      <Button
        onClick={() => {
          navigate(-1)
        }}
      >
        뒤로가기
      </Button>
    </main>
  )
}
