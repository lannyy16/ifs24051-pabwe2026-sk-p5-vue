import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockPinia } from '../../../test-utils'
import { useAucationsStore } from './aucationsStore'
import * as api from '../api/aucationApi'

vi.mock('../api/aucationApi')

describe('aucationsStore', () => {
  beforeEach(() => createMockPinia())

  it('fetchAucations dengan params, sukses dan gagal', async () => {
    const store = useAucationsStore()
    api.getAucations.mockResolvedValue({ status: 'success', data: { aucations: [{ id: 1 }] } })
    const pending = store.fetchAucations({ is_me: 1 })
    expect(store.isAucation).toBe(true)
    await pending
    expect(api.getAucations).toHaveBeenCalledWith({ is_me: 1 })
    expect(store.aucations).toEqual([{ id: 1 }])
    expect(store.isAucation).toBe(false)

    api.getAucations.mockResolvedValue({ status: 'fail' })
    await store.fetchAucations()
    expect(store.aucations).toEqual([])
  })

  it('fetchAucation sukses dan gagal', async () => {
    const store = useAucationsStore()
    api.getAucation.mockResolvedValue({ status: 'success', data: { aucation: { id: 3 } } })
    await store.fetchAucation(3)
    expect(store.aucation).toEqual({ id: 3 })
    api.getAucation.mockResolvedValue({ status: 'fail' })
    await store.fetchAucation(4)
    expect(store.aucation).toBeNull()
  })

  const cases = [
    ['addAucation', 'addAucation', 'isAucationAdd', 'isAucationAdded', [{ title: 'x' }]],
    ['changeAucation', 'changeAucation', 'isAucationChange', 'isAucationChanged', [1, { title: 'x' }]],
    ['changeCover', 'changeCover', 'isAucationChangeCover', 'isAucationChangedCover', [1, new File([], 'a.png')]],
    ['deleteAucation', 'deleteAucation', 'isAucationDelete', 'isAucationDeleted', [1]],
    ['addBid', 'addBid', 'isBidAdd', 'isBidAdded', [1, 5000]],
    ['deleteBid', 'deleteBid', 'isBidDelete', 'isBidDeleted', [1]],
    ['deleteAllAucations', 'deleteAllAucations', 'isAucationDeleteAll', 'isAucationDeletedAll', []],
  ]

  it.each(cases)('%s melacak status mutasi', async (action, apiName, loadingKey, doneKey, args) => {
    const store = useAucationsStore()
    api[apiName].mockResolvedValue({ status: 'success', message: 'ok' })
    const pending = store[action](...args)
    expect(store[loadingKey]).toBe(true)
    expect(store[doneKey]).toBe(false)
    const response = await pending
    expect(response.message).toBe('ok')
    expect(api[apiName]).toHaveBeenCalledWith(...args)
    expect(store[loadingKey]).toBe(false)
    expect(store[doneKey]).toBe(true)

    api[apiName].mockResolvedValue({ status: 'fail' })
    await store[action](...args)
    expect(store[doneKey]).toBe(false)
  })
})
