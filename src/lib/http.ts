import axios, { AxiosError, type AxiosInstance } from 'axios'

const TOKEN_KEY = 'ops-panel.token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null): void {
  try {
    if (token === null) localStorage.removeItem(TOKEN_KEY)
    else localStorage.setItem(TOKEN_KEY, token)
  } catch {}
}

export interface ApiError {
  status: number
  message: string
  fields?: Record<string, string>
}

export function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'status' in value && 'message' in value
}

const FALLBACK_MESSAGES: Record<number, string> = {
  0: 'Network unavailable. Check your connection and try again.',
  400: 'The request was invalid.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  422: 'Please correct the highlighted fields.',
  429: 'Too many requests. Please slow down.',
  500: 'Something went wrong on our side. Please try again.',
}

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    const status = error.response?.status ?? 0
    const body = error.response?.data

    const apiError: ApiError = {
      status,
      message: body?.message ?? FALLBACK_MESSAGES[status] ?? 'Unexpected error.',
      fields: body?.errors,
    }

    if (status === 401) setToken(null)

    return Promise.reject(apiError)
  },
)
