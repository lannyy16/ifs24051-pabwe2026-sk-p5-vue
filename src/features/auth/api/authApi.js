import { apiFetch, putAccessToken } from '../../../helpers/apiHelper'

export async function loginApi(payload) {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: new URLSearchParams(payload),
  })

  const token = response?.data?.token || response?.token || ''
  if (token) putAccessToken(token)

  return response
}

export async function registerApi(payload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: new URLSearchParams(payload),
  })
}

export async function logoutApi() {
  putAccessToken('')
}
