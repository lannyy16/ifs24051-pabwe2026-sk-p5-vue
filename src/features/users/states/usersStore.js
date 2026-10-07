import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getUsersApi,
  getMeApi,
  updateMeApi,
  updatePhotoApi,
  updatePasswordApi,
} from '../api/userApi'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const me = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchUsers(query = {}) {
    loading.value = true
    error.value = ''
    try {
      const response = await getUsersApi(query)
      users.value = response?.data || []
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    loading.value = true
    error.value = ''
    try {
      const response = await getMeApi()
      me.value = response?.data || null
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateMe(payload) {
    const response = await updateMeApi(payload)
    me.value = response?.data || me.value
    return response
  }

  async function updatePhoto(file) {
    const response = await updatePhotoApi(file)
    me.value = response?.data || me.value
    return response
  }

  async function updatePassword(payload) {
    return updatePasswordApi(payload)
  }

  return {
    users,
    me,
    loading,
    error,
    fetchUsers,
    fetchMe,
    updateMe,
    updatePhoto,
    updatePassword,
  }
})
