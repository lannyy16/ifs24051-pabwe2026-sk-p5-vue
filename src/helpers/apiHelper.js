const TOKEN_KEY = 'delcom_access_token'

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY)
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY)

export const isSuccess = (response) => response?.status === 'success'

/** Membangun URL lengkap beserta query parameters (nilai kosong diabaikan). */
export function buildUrl(path, params) {
  const url = new URL(`${DELCOM_BASEURL}${path}`)
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}

/**
 * Wrapper fetch untuk REST API Delcom.
 * - Header Authorization: Bearer <token> otomatis (jika ada token dan auth = true)
 * - body berupa FormData dikirim apa adanya, selain itu di-encode sebagai JSON
 * - Selalu mengembalikan objek { status, message, data } (tidak pernah throw)
 */
export async function fetchApi(path, { method = 'GET', params, body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  const options = { method, headers }

  if (auth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  if (body instanceof FormData) {
    options.body = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(buildUrl(path, params), options)
    const json = await response.json()
    if (response.status === 401) removeAccessToken()
    return { ...json, httpStatus: response.status }
  } catch {
    return { status: 'fail', message: 'Tidak dapat terhubung ke server', httpStatus: 0 }
  }
}

export const apiGet = (path, params) => fetchApi(path, { params })
export const apiPost = (path, body, auth) => fetchApi(path, { method: 'POST', body, auth })
export const apiPut = (path, body) => fetchApi(path, { method: 'PUT', body })
export const apiDelete = (path) => fetchApi(path, { method: 'DELETE' })
