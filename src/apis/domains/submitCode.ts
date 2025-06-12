import { baseFetcher } from '../apiClient'
import { END_POINTS } from '../path'
import { SubmitCodeDto, SubmitCodeResponse } from '../types/submitCode'

/**
 * 코드 제출 및 채점 요청
 */
export const requestSubmitCode = async (data: SubmitCodeDto) => {
  const response = await baseFetcher.post<SubmitCodeResponse>(
    END_POINTS.SUBMIT_CODE,
    {
      json: data,
    },
  )

  return response.json()
}
