import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { requestSubmitCode } from '@/apis/domains/submitCode'
import { SubmitCodeDto, SubmitCodeResponse } from '@/apis/types/submitCode'
import { queryKeys } from '../key'
import APIError from '@/apis/APIError'

/**
 * 코드 제출 및 채점 Mutation 훅
 */
export const useSubmitCodeMutation = (
  options?: UseMutationOptions<SubmitCodeResponse, APIError, SubmitCodeDto>,
) => {
  return useMutation({
    mutationKey: queryKeys.submitCode.all,
    mutationFn: requestSubmitCode,
    ...options,
  })
}
