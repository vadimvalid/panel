import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { http, setToken, getToken, isApiError, type ApiError } from '@/lib/http'
import type { AuthSession, Role, User } from '@/types/domain'

const ROLE_RANK: Record<Role, number> = { viewer: 0, support: 1, admin: 2 }

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const initialising = ref(true)

  const isAuthenticated = computed(() => user.value !== null)

  function can(minimum: Role): boolean {
    if (!user.value) return false
    return ROLE_RANK[user.value.role] >= ROLE_RANK[minimum]
  }

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const { data } = await http.post<AuthSession>('/auth/login', { email, password })
      setToken(data.token)
      user.value = data.user
      return true
    } catch (e) {
      error.value = isApiError(e) ? e : { status: 0, message: 'Unexpected error.' }
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await http.post('/auth/logout')
    } catch {
    } finally {
      setToken(null)
      user.value = null
    }
  }

  async function restore(): Promise<void> {
    initialising.value = true
    try {
      if (!getToken()) return
      const { data } = await http.get<User>('/auth/me')
      user.value = data
    } catch {
      user.value = null
    } finally {
      initialising.value = false
    }
  }

  return { user, loading, error, initialising, isAuthenticated, can, login, logout, restore }
})
