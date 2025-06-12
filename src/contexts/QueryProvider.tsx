import type { ReactNode } from 'react'
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import APIError from '@/apis/APIError'
import { getErrorMessage } from '@/constants/errorCode'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true, // reset data on ErrorBoundary Component
      retry: 0,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof APIError) {
        toast.error(getErrorMessage(error.status) || '요청에 실패햐였습니다.')
      } else {
        toast.error('알 수 없는 에러가 발생했습니다.')
      }
    },
  }),
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
