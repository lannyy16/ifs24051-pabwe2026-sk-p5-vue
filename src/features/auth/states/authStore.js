import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authApi from '../api/authApi'
import {
  getAccessToken,
  isSuccess,
  putAccessToken,
  removeAccessToken,
} from '../../../helpers/apiHelper'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getAccessToken())
  const isLoading = ref(false)
  // Flag keberhasilan aksi terakhir
  const isAuthLogin = ref(false)
  const isAuthRegister = ref(false)
  const isAuthLogout = ref(false)
  // Status validasi dari server: null atau { message, errors }
  const validation = ref(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  function startRequest() {
    isLoading.value = true
    validation.value = null
  }

  function finishRequest(response) {
    isLoading.value = false
    const ok = isSuccess(response)
    validation.value = ok ? null : { message: response.message, errors: response.data ?? {} }
    return ok
  }

  async function login(credentials) {
    startRequest()
    isAuthLogin.value = false
    const response = await authApi.login(credentials)
    if (finishRequest(response)) {
      token.value = response.data.token
      putAccessToken(token.value)
      isAuthLogin.value = true
    }
    return response
  }

  async function register(payload) {
    startRequest()
    isAuthRegister.value = false
    const response = await authApi.register(payload)
    isAuthRegister.value = finishRequest(response)
    return response
  }

  /** Hapus sesi lokal (dipakai saat logout maupun token kedaluwarsa). */
  function clearSession() {
    removeAccessToken()
    token.value = null
  }

  async function logout() {
    startRequest()
    isAuthLogout.value = false
    const response = await authApi.logout()
    clearSession()
    finishRequest(response)
    isAuthLogout.value = true
    return response
  }

  return {
    token,
    isLoading,
    isAuthLogin,
    isAuthRegister,
    isAuthLogout,
    validation,
    isAuthenticated,
    login,
    register,
    logout,
    clearSession,
  }
})
