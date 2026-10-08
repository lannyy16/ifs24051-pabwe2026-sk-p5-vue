import { describe, expect, it, vi } from 'vitest'
import * as api from './aucationApi'
import * as apiHelper from '../../../helpers/apiHelper'

vi.mock('../../../helpers/apiHelper', () => ({
  apiGet: vi.fn(() => Promise.resolve({})),
  apiPost: vi.fn(() => Promise.resolve({})),
  apiPut: vi.fn(() => Promise.resolve({})),
  apiDelete: vi.fn(() => Promise.resolve({})),
}))

const form = { title: 'T', description: 'D', start_bid: 100, closed_at: '2026-12-31 23:59:00' }

describe('aucationApi', () => {
  it('GET daftar (dengan filter) dan detail', async () => {
    await api.getAucations({ is_me: 1 })
    await api.getAucation(5)
    expect(apiHelper.apiGet.mock.calls).toEqual([['/aucations', { is_me: 1 }], ['/aucations/5']])
  })

  it('tambah & ubah lelang hanya mengirim field yang diizinkan', async () => {
    await api.addAucation({ ...form, lain: 1 })
    await api.changeAucation(5, { ...form, lain: 1 })
    expect(apiHelper.apiPost).toHaveBeenCalledWith('/aucations', form)
    expect(apiHelper.apiPut).toHaveBeenCalledWith('/aucations/5', form)
  })

  it('ganti cover memakai FormData field "cover"', async () => {
    const file = new File(['x'], 'c.png', { type: 'image/png' })
    await api.changeCover(5, file)
    const [path, body] = apiHelper.apiPost.mock.calls[0]
    expect(path).toBe('/aucations/5/cover')
    expect(body.get('cover')).toBe(file)
  })

  it('hapus lelang, bid, dan semua lelang', async () => {
    await api.deleteAucation(5)
    await api.addBid(5, 9000)
    await api.deleteBid(5)
    await api.deleteAllAucations()
    expect(apiHelper.apiDelete.mock.calls).toEqual([['/aucations/5'], ['/aucations/5/bids'], ['/aucations']])
    expect(apiHelper.apiPost).toHaveBeenCalledWith('/aucations/5/bids', { bid: 9000 })
  })
})
