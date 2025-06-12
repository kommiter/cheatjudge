import ky from 'ky'
import APIError from './APIError'
import { API_URL } from './path'

export const baseFetcher = ky.create({
  prefixUrl: API_URL,
  retry: {
    limit: 1,
    statusCodes: [403],
  },
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          throw (await response.json()) as APIError
        }

        return response
      },
    ],
  },
})
