import { apiFetch, toFormData } from '../../../helpers/apiHelper'

export async function getUsersApi(query = {}) {
  return apiFetch('/users', { query })
}

export async function getMeApi() {
  return apiFetch('/users/me')
}

export async function updateMeApi(payload) {
  return apiFetch('/users/me', {
    method: 'PUT',
    body: new URLSearchParams(payload),
  })
}

export async function updatePhotoApi(file) {
  const body = toFormData({ photo: file })
  return apiFetch('/users/me/photo', {
    method: 'POST',
    body,
  })
}

export async function updatePasswordApi(payload) {
  return apiFetch('/users/me/password', {
    method: 'PUT',
    body: new URLSearchParams(payload),
  })
}
