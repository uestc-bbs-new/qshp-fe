type HttpErrorDetails = {
  status: number
  statusText: string
}
type ApiErrorDetails = {
  code: number
  message: string
}
export type ApiError = {
  type: 'api' | 'http' | 'network' | 'invalid'
  details?: any
} & Partial<HttpErrorDetails> &
  Partial<ApiErrorDetails>
