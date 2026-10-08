import {
  apiFetch,
  toFormData,
} from '../../../helpers/apiHelper'

export async function getAucationsApi(
  query = {},
) {
  return apiFetch('/aucations', {
    query,
  })
}

export async function getAucationApi(id) {
  return apiFetch(`/aucations/${id}`)
}

export async function addAucationApi(
  payload,
) {
  const {
    title,
    description,
    start_bid,
    closed_at,
  } = payload

  return apiFetch('/aucations', {
    method: 'POST',
    body: JSON.stringify({
      title: String(title).trim(),
      description: String(
        description,
      ).trim(),
      start_bid: Number(start_bid),
      closed_at,
    }),
  })
}

export async function updateAucationApi(
  id,
  payload,
) {
  const {
    title,
    description,
    start_bid,
    closed_at,
  } = payload

  return apiFetch(`/aucations/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: String(title).trim(),
      description: String(
        description,
      ).trim(),
      start_bid: Number(start_bid),
      closed_at,
    }),
  })
}

export async function changeCoverApi(
  id,
  file,
) {
  if (!file) {
    throw new Error(
      'File cover belum dipilih',
    )
  }

  const formData = toFormData({
    cover: file,
  })

  return apiFetch(
    `/aucations/${id}/cover`,
    {
      method: 'POST',
      body: formData,
    },
  )
}

export async function deleteAucationApi(
  id,
) {
  return apiFetch(`/aucations/${id}`, {
    method: 'DELETE',
  })
}

export async function addBidApi(
  id,
  bid,
) {
  return apiFetch(
    `/aucations/${id}/bids`,
    {
      method: 'POST',
      body: JSON.stringify({
        bid: Number(bid),
      }),
    },
  )
}

export async function deleteBidApi(id) {
  return apiFetch(
    `/aucations/${id}/bids`,
    {
      method: 'DELETE',
    },
  )
}

export async function deleteAllAucationsApi() {
  return apiFetch('/aucations', {
    method: 'DELETE',
  })
}