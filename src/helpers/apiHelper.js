const BASE_URL =
  import.meta.env.VITE_DELCOM_BASEURL ||
  'https://open-api.delcom.org/api/v1'

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

function buildQuery(query = {}) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      params.append(key, value)
    }
  })

  const queryString = params.toString()

  return queryString ? `?${queryString}` : ''
}

async function parseResponse(response) {
  const contentType =
    response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

function getErrorMessage(data, fallback) {
  if (!data) {
    return fallback
  }

  if (typeof data === 'string') {
    return data || fallback
  }

  if (data.message) {
    let message = data.message

    if (
      data.data &&
      data.data.field &&
      typeof data.data.field === 'object'
    ) {
      const fieldMessages = []

      Object.values(data.data.field).forEach(
        (messages) => {
          if (Array.isArray(messages)) {
            fieldMessages.push(...messages)
          } else if (messages) {
            fieldMessages.push(messages)
          }
        },
      )

      if (fieldMessages.length > 0) {
        message += `: ${fieldMessages.join(', ')}`
      }
    }

    return message
  }

  return fallback
}

export async function apiFetch(
  path,
  options = {},
) {
  const {
    query = {},
    headers = {},
    body,
    ...fetchOptions
  } = options

  const token = getAccessToken()

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (token) {
    requestHeaders.Authorization =
      `Bearer ${token}`
  }

  const isFormData =
    body instanceof FormData

  if (
    body !== undefined &&
    !isFormData &&
    !requestHeaders['Content-Type']
  ) {
    requestHeaders['Content-Type'] =
      'application/json'
  }

  const url =
    `${BASE_URL}${path}${buildQuery(query)}`

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
    body,
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    const error = new Error(
      getErrorMessage(
        data,
        `Request gagal dengan status ${response.status}`,
      ),
    )

    error.status = response.status
    error.data = data

    throw error
  }

  if (
    data &&
    typeof data === 'object' &&
    data.status === 'fail'
  ) {
    const error = new Error(
      getErrorMessage(
        data,
        'Request gagal',
      ),
    )

    error.status = response.status
    error.data = data

    throw error
  }

  return data
}

export function toFormData(data = {}) {
  const formData = new FormData()

  Object.entries(data).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null
      ) {
        formData.append(key, value)
      }
    },
  )

  return formData
}