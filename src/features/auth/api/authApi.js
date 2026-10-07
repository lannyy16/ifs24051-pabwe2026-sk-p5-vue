import {
  apiFetch,
  getAccessToken,
  putAccessToken,
  toFormData,
} from '../../../helpers/apiHelper'

export async function registerApi(data) {
  const formData = toFormData({
    name: data.name,
    email: data.email,
    password: data.password,
  })

  return apiFetch('/auth/register', {
    method: 'POST',
    body: formData,
  })
}

export async function loginApi(data) {
  const formData = toFormData({
    email: data.email,
    password: data.password,
  })

  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: formData,
  })

  const token =
    response?.data?.token ||
    response?.token ||
    response?.data?.access_token ||
    response?.access_token

  if (token) {
    putAccessToken(token)
  }

  return response
}

export async function logoutApi() {
  const token = getAccessToken()

  if (token) {
    putAccessToken(null)
  }

  return {
    success: true,
    message: 'Berhasil logout',
  }
}

// Alias agar tetap kompatibel jika file lain menggunakan nama ini.
export const register = registerApi
export const login = loginApi
export const logout = logoutApi