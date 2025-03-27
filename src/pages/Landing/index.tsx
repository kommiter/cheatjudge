import { Button } from '@/components/ui/button.tsx'
import { toast } from 'sonner'

export default function Landing() {
  return (
    <Button onClick={() => toast.error('요청에 실패햐였습니다.', {})}>
      Click me
    </Button>
  )
}
