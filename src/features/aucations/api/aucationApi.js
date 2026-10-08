import { apiDelete, apiGet, apiPost, apiPut } from '../../../helpers/apiHelper'

/** params: { is_me: 1, is_closed: 0 | 1 } */
export const getAucations = (params) => apiGet('/aucations', params)
export const getAucation = (id) => apiGet(`/aucations/${id}`)

export const addAucation = ({ title, description, start_bid, closed_at }) =>
  apiPost('/aucations', { title, description, start_bid, closed_at })

export const changeAucation = (id, { title, description, start_bid, closed_at }) =>
  apiPut(`/aucations/${id}`, { title, description, start_bid, closed_at })

export const changeCover = (id, file) => {
  const formData = new FormData()
  formData.append('cover', file)
  return apiPost(`/aucations/${id}/cover`, formData)
}

export const deleteAucation = (id) => apiDelete(`/aucations/${id}`)
export const addBid = (id, bid) => apiPost(`/aucations/${id}/bids`, { bid })
export const deleteBid = (id) => apiDelete(`/aucations/${id}/bids`)
export const deleteAllAucations = () => apiDelete('/aucations')
