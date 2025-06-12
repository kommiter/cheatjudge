import { ErrorCode } from '@/constants/errorCode'

class APIError extends Error {
  status: ErrorCode

  constructor(status: ErrorCode, message?: string) {
    super(message || `API Error: ${status}`)
    this.status = status
  }
}

export default APIError
