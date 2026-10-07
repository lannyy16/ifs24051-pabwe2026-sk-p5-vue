import { apiFetch, toFormData } from '../../../helpers/apiHelper'

export async function getAucationsApi(query = {}) {
  return apiFetch('/aucations', { query })
}

export async function getAucationApi(id) {
  return apiFetch(`/aucations/${id}`)
}

export async function addAucationApi(payload) {
  return apiFetch('/aucations', {
    method: 'POST',
    body: toFormData(payload),
  })
}

export async function updateAucationApi(id, payload) {
  return apiFetch(`/aucations/${id}`, {
    method: 'PUT',
    body: new URLSearchParams(payload),
  })
}

export async function changeCoverApi(id, file) {
  return apiFetch(`/aucations/${id}/cover`, {
    method: 'POST',
    body: toFormData({ cover: file }),
  })
}

export async function deleteAucationApi(id) {
  return apiFetch(`/aucations/${id}`, {
    method: 'DELETE',
  })
}

export async function addBidApi(id, bid) {
  return apiFetch(`/aucations/${id}/bids`, {
    method: 'POST',
    body: new URLSearchParams({ bid: String(bid) }),
  })
}

export async function deleteBidApi(id) {
  return apiFetch(`/aucations/${id}/bids`, {
    method: 'DELETE',
  })
}

export async function deleteAllAucationsApi() {
  return apiFetch('/aucations', {
    method: 'DELETE',
  })
}
