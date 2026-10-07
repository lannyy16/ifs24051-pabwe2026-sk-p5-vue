import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getAccessToken, putAccessToken } from '../../../helpers/apiHelper'
import { loginApi, registerApi, logoutApi } from '../api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getAccessToken())
  const loading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(payload) {
    loading.value = true
    error.value = ''

    try {
      const response = await loginApi(payload)
      token.value = getAccessToken()
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value = ''

    try {
      return await registerApi(payload)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await logoutApi()
    token.value = ''
    putAccessToken('')
  }

  return {
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
