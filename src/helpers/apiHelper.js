const BASE_URL =
  typeof DELCOM_BASEURL !== 'undefined'
    ? DELCOM_BASEURL
    : 'https://open-api.delcom.org/api/v1'

export function getAccessToken() {
  return localStorage.getItem('access_token') || ''
}

export function putAccessToken(token) {
  if (token) {
    localStorage.setItem('access_token', token)
  } else {
    localStorage.removeItem('access_token')
  }
}

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    query = {},
    body,
    headers = {},
  } = options

  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value))
    }
  })

  const queryString = params.toString()
  const url = `${BASE_URL}${path}${queryString ? `?${queryString}` : ''}`

  const finalHeaders = new Headers(headers)
  const token = getAccessToken()

  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  if (body && !(body instanceof FormData) && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/x-www-form-urlencoded')
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body,
  })

  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`

    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export function toFormData(data = {}) {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  return formData
}
