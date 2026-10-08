import { apiGet, apiPost, apiPut } from '../../../helpers/apiHelper'

export const getUsers = () => apiGet('/users')
export const getUserById = (id) => apiGet(`/users/${id}`)
export const getProfile = () => apiGet('/users/me')
export const updateProfile = ({ name, email }) => apiPut('/users/me', { name, email })

export const uploadPhoto = (file) => {
  const formData = new FormData()
  formData.append('photo', file)
  return apiPost('/users/me/photo', formData)
}

// Sesuai dokumentasi Delcom Open API: PUT /users/password
export const changePassword = ({ password, new_password, new_password_confirmation }) =>
  apiPut('/users/password', { password, new_password, new_password_confirmation })
