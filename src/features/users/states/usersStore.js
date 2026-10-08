import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as userApi from '../api/userApi'
import { isSuccess } from '../../../helpers/apiHelper'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const user = ref(null)
  const profile = ref(null)
  const isLoading = ref(false)
  const isProfileChange = ref(false)
  const isProfileChanged = ref(false)
  const isPhotoChange = ref(false)
  const isPhotoChanged = ref(false)
  const isPasswordChange = ref(false)
  const isPasswordChanged = ref(false)

  async function fetchUsers() {
    isLoading.value = true
    const response = await userApi.getUsers()
    users.value = isSuccess(response) ? response.data.users : []
    isLoading.value = false
    return response
  }

  async function fetchUser(id) {
    isLoading.value = true
    const response = await userApi.getUserById(id)
    user.value = isSuccess(response) ? response.data.user : null
    isLoading.value = false
    return response
  }

  async function fetchProfile() {
    isLoading.value = true
    const response = await userApi.getProfile()
    profile.value = isSuccess(response) ? response.data.user : null
    isLoading.value = false
    return response
  }

  function track(loading, done, call) {
    return async (...args) => {
      loading.value = true
      done.value = false
      const response = await call(...args)
      loading.value = false
      done.value = isSuccess(response)
      return response
    }
  }

  const updateProfile = track(isProfileChange, isProfileChanged, (payload) => userApi.updateProfile(payload))
  const uploadPhoto = track(isPhotoChange, isPhotoChanged, (file) => userApi.uploadPhoto(file))
  const changePassword = track(isPasswordChange, isPasswordChanged, (payload) => userApi.changePassword(payload))

  return {
    users,
    user,
    profile,
    isLoading,
    isProfileChange,
    isProfileChanged,
    isPhotoChange,
    isPhotoChanged,
    isPasswordChange,
    isPasswordChanged,
    fetchUsers,
    fetchUser,
    fetchProfile,
    updateProfile,
    uploadPhoto,
    changePassword,
  }
})
