import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  createPinia,
  setActivePinia,
} from 'pinia'

import {
  getAucationsApi,
  getAucationApi,
  addAucationApi,
  updateAucationApi,
  changeCoverApi,
  deleteAucationApi,
  addBidApi,
  deleteBidApi,
  deleteAllAucationsApi,
} from '../api/aucationApi'

import {
  useAucationsStore,
} from './aucationsStore'

vi.mock('../api/aucationApi', () => ({
  getAucationsApi: vi.fn(),
  getAucationApi: vi.fn(),
  addAucationApi: vi.fn(),
  updateAucationApi: vi.fn(),
  changeCoverApi: vi.fn(),
  deleteAucationApi: vi.fn(),
  addBidApi: vi.fn(),
  deleteBidApi: vi.fn(),
  deleteAllAucationsApi: vi.fn(),
}))

describe('aucationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('memiliki state awal yang benar', () => {
      const store = useAucationsStore()

      expect(store.aucations).toEqual([])
      expect(store.currentAucation).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBe('')

      expect(store.status).toEqual({
        fetching: false,
        adding: false,
        updating: false,
        deleting: false,
        bidding: false,
        changingCover: false,
      })
    })
  })

  describe('fetchAucations', () => {
    it('berhasil mengambil daftar lelang', async () => {
      const response = {
        status: 'success',
        data: {
          aucations: [
            {
              id: 1,
              title: 'Laptop',
            },
            {
              id: 2,
              title: 'Handphone',
            },
          ],
        },
      }

      getAucationsApi.mockResolvedValue(response)

      const store = useAucationsStore()

      const result =
        await store.fetchAucations({
          is_closed: 1,
        })

      expect(
        getAucationsApi,
      ).toHaveBeenCalledTimes(1)

      expect(
        getAucationsApi,
      ).toHaveBeenCalledWith({
        is_closed: 1,
      })

      expect(store.aucations).toEqual(
        response.data.aucations,
      )

      expect(store.loading).toBe(false)
      expect(store.status.fetching).toBe(false)
      expect(store.error).toBe('')

      expect(result).toEqual(response)
    })

    it('menggunakan query kosong secara default', async () => {
      const response = {
        status: 'success',
        data: {
          aucations: [],
        },
      }

      getAucationsApi.mockResolvedValue(response)

      const store = useAucationsStore()

      await store.fetchAucations()

      expect(
        getAucationsApi,
      ).toHaveBeenCalledWith({})

      expect(store.aucations).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.status.fetching).toBe(false)
    })

    it('menggunakan array kosong jika response tidak memiliki aucations', async () => {
      const response = {
        status: 'success',
        data: {},
      }

      getAucationsApi.mockResolvedValue(response)

      const store = useAucationsStore()

      await store.fetchAucations()

      expect(store.aucations).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.status.fetching).toBe(false)
    })

    it('menggunakan array kosong jika response tidak memiliki data', async () => {
      const response = {
        status: 'success',
      }

      getAucationsApi.mockResolvedValue(response)

      const store = useAucationsStore()

      await store.fetchAucations()

      expect(store.aucations).toEqual([])
    })

    it('menangani error dengan message', async () => {
      const error = new Error(
        'Gagal mengambil lelang',
      )

      getAucationsApi.mockRejectedValue(error)

      const store = useAucationsStore()

      await expect(
        store.fetchAucations(),
      ).rejects.toThrow(
        'Gagal mengambil lelang',
      )

      expect(store.error).toBe(
        'Gagal mengambil lelang',
      )

      expect(store.loading).toBe(false)
      expect(store.status.fetching).toBe(false)
    })

    it('menggunakan pesan default jika error tidak memiliki message', async () => {
      getAucationsApi.mockRejectedValue({
        message: '',
      })

      const store = useAucationsStore()

      await expect(
        store.fetchAucations(),
      ).rejects.toEqual({
        message: '',
      })

      expect(store.error).toBe(
        'Gagal mengambil data lelang',
      )

      expect(store.loading).toBe(false)
      expect(store.status.fetching).toBe(false)
    })

    it('mengubah loading dan status fetching selama proses request', async () => {
      let resolveRequest

      getAucationsApi.mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
      )

      const store = useAucationsStore()

      const promise =
        store.fetchAucations()

      expect(store.loading).toBe(true)
      expect(store.status.fetching).toBe(true)

      resolveRequest({
        status: 'success',
        data: {
          aucations: [],
        },
      })

      await promise

      expect(store.loading).toBe(false)
      expect(store.status.fetching).toBe(false)
    })
  })

  describe('fetchAucation', () => {
    it('berhasil mengambil detail lelang', async () => {
      const response = {
        status: 'success',
        data: {
          aucation: {
            id: 10,
            title: 'Laptop Gaming',
          },
        },
      }

      getAucationApi.mockResolvedValue(response)

      const store = useAucationsStore()

      const result =
        await store.fetchAucation(10)

      expect(
        getAucationApi,
      ).toHaveBeenCalledTimes(1)

      expect(
        getAucationApi,
      ).toHaveBeenCalledWith(10)

      expect(store.currentAucation).toEqual(
        response.data.aucation,
      )

      expect(store.loading).toBe(false)
      expect(store.error).toBe('')

      expect(result).toEqual(response)
    })

    it('menggunakan null jika response tidak memiliki aucation', async () => {
      const response = {
        status: 'success',
        data: {},
      }

      getAucationApi.mockResolvedValue(response)

      const store = useAucationsStore()

      await store.fetchAucation(10)

      expect(
        store.currentAucation,
      ).toBeNull()

      expect(store.loading).toBe(false)
    })

    it('menggunakan null jika response tidak memiliki data', async () => {
      const response = {
        status: 'success',
      }

      getAucationApi.mockResolvedValue(response)

      const store = useAucationsStore()

      await store.fetchAucation(10)

      expect(
        store.currentAucation,
      ).toBeNull()
    })

    it('menangani error dengan message', async () => {
      const error = new Error(
        'Lelang tidak ditemukan',
      )

      getAucationApi.mockRejectedValue(error)

      const store = useAucationsStore()

      await expect(
        store.fetchAucation(99),
      ).rejects.toThrow(
        'Lelang tidak ditemukan',
      )

      expect(store.error).toBe(
        'Lelang tidak ditemukan',
      )

      expect(store.loading).toBe(false)
    })

    it('menggunakan pesan default jika error tidak memiliki message', async () => {
      getAucationApi.mockRejectedValue({
        message: '',
      })

      const store = useAucationsStore()

      await expect(
        store.fetchAucation(99),
      ).rejects.toEqual({
        message: '',
      })

      expect(store.error).toBe(
        'Gagal mengambil detail lelang',
      )

      expect(store.loading).toBe(false)
    })
  })

  describe('addAucation', () => {
    it('berhasil menambahkan lelang tanpa cover', async () => {
      const payload = {
        title: 'Laptop',
        description: 'Laptop bekas',
        start_bid: 5000000,
        closed_at:
          '2026-10-20 20:00:00',
      }

      const response = {
        status: 'success',
        data: {
          aucation_id: 100,
        },
      }

      addAucationApi.mockResolvedValue(
        response,
      )

      const store = useAucationsStore()

      const result =
        await store.addAucation(payload)

      expect(
        addAucationApi,
      ).toHaveBeenCalledWith(payload)

      expect(
        changeCoverApi,
      ).not.toHaveBeenCalled()

      expect(store.status.adding).toBe(false)
      expect(store.error).toBe('')

      expect(result).toEqual(response)
    })

    it('mengupload cover menggunakan aucation_id dari response', async () => {
      const file = new File(
        ['cover'],
        'cover.jpg',
        {
          type: 'image/jpeg',
        },
      )

      const payload = {
        title: 'Laptop',
        description: 'Laptop gaming',
        start_bid: 5000000,
        closed_at:
          '2026-10-20',
        cover: file,
      }

      const response = {
        status: 'success',
        data: {
          aucation_id: 101,
        },
      }

      addAucationApi.mockResolvedValue(
        response,
      )

      changeCoverApi.mockResolvedValue({
        status: 'success',
      })

      const store = useAucationsStore()

      const result =
        await store.addAucation(payload)

      expect(
        changeCoverApi,
      ).toHaveBeenCalledTimes(1)

      expect(
        changeCoverApi,
      ).toHaveBeenCalledWith(
        101,
        file,
      )

      expect(store.status.adding).toBe(false)
      expect(result).toEqual(response)
    })

    it('menggunakan id dari response.data.id jika aucation_id tidak tersedia', async () => {
      const file = new File(
        ['cover'],
        'cover.png',
      )

      const payload = {
        title: 'Barang',
        description: 'Deskripsi',
        start_bid: 100000,
        closed_at:
          '2026-10-20',
        cover: file,
      }

      const response = {
        status: 'success',
        data: {
          id: 102,
        },
      }

      addAucationApi.mockResolvedValue(
        response,
      )

      changeCoverApi.mockResolvedValue({
        status: 'success',
      })

      const store = useAucationsStore()

      await store.addAucation(payload)

      expect(
        changeCoverApi,
      ).toHaveBeenCalledWith(
        102,
        file,
      )
    })

    it('menggunakan aucation_id dari root response jika data tidak memiliki id', async () => {
      const file = new File(
        ['cover'],
        'cover.png',
      )

      const payload = {
        title: 'Barang',
        description: 'Deskripsi',
        start_bid: 200000,
        closed_at:
          '2026-10-21',
        cover: file,
      }

      const response = {
        status: 'success',
        aucation_id: 103,
      }

      addAucationApi.mockResolvedValue(
        response,
      )

      changeCoverApi.mockResolvedValue({
        status: 'success',
      })

      const store = useAucationsStore()

      await store.addAucation(payload)

      expect(
        changeCoverApi,
      ).toHaveBeenCalledWith(
        103,
        file,
      )
    })

    it('tidak mengupload cover jika cover ada tetapi id tidak ditemukan', async () => {
      const file = new File(
        ['cover'],
        'cover.jpg',
      )

      const payload = {
        title: 'Barang',
        description: 'Deskripsi',
        start_bid: 100000,
        closed_at:
          '2026-10-22',
        cover: file,
      }

      addAucationApi.mockResolvedValue({
        status: 'success',
        data: {},
      })

      const store = useAucationsStore()

      await store.addAucation(payload)

      expect(
        changeCoverApi,
      ).not.toHaveBeenCalled()

      expect(store.status.adding).toBe(false)
    })

    it('menangani error dari addAucationApi', async () => {
      const error = new Error(
        'Gagal menambahkan lelang',
      )

      addAucationApi.mockRejectedValue(error)

      const store = useAucationsStore()

      await expect(
        store.addAucation({
          title: 'Barang',
        }),
      ).rejects.toThrow(
        'Gagal menambahkan lelang',
      )

      expect(store.error).toBe(
        'Gagal menambahkan lelang',
      )

      expect(store.status.adding).toBe(false)
    })

    it('menggunakan pesan default jika error tidak memiliki message', async () => {
      addAucationApi.mockRejectedValue({
        message: '',
      })

      const store = useAucationsStore()

      await expect(
        store.addAucation({
          title: 'Barang',
        }),
      ).rejects.toEqual({
        message: '',
      })

      expect(store.error).toBe(
        'Gagal menambahkan lelang',
      )

      expect(store.status.adding).toBe(false)
    })

    it('mengembalikan status adding false setelah upload cover gagal', async () => {
      const file = new File(
        ['cover'],
        'cover.jpg',
      )

      const payload = {
        title: 'Barang',
        cover: file,
      }

      addAucationApi.mockResolvedValue({
        status: 'success',
        data: {
          aucation_id: 104,
        },
      })

      const error = new Error(
        'Upload cover gagal',
      )

      changeCoverApi.mockRejectedValue(error)

      const store = useAucationsStore()

      await expect(
        store.addAucation(payload),
      ).rejects.toThrow(
        'Upload cover gagal',
      )

      expect(store.error).toBe(
        'Upload cover gagal',
      )

      expect(store.status.adding).toBe(false)
    })
  })

  describe('updateAucation', () => {
    it('berhasil mengupdate lelang', async () => {
      const payload = {
        title: 'Laptop Updated',
        description:
          'Deskripsi updated',
        start_bid: 6000000,
        closed_at:
          '2026-10-25',
      }

      const response = {
        status: 'success',
        message: 'Updated',
      }

      updateAucationApi.mockResolvedValue(
        response,
      )

      const store = useAucationsStore()

      const result =
        await store.updateAucation(
          200,
          payload,
        )

      expect(
        updateAucationApi,
      ).toHaveBeenCalledWith(
        200,
        payload,
      )

      expect(store.status.updating).toBe(
        false,
      )

      expect(result).toEqual(response)
    })

    it('mengembalikan status updating false ketika update gagal', async () => {
      const error = new Error(
        'Update gagal',
      )

      updateAucationApi.mockRejectedValue(
        error,
      )

      const store = useAucationsStore()

      await expect(
        store.updateAucation(
          200,
          {
            title: 'Laptop',
          },
        ),
      ).rejects.toThrow(
        'Update gagal',
      )

      expect(store.status.updating).toBe(
        false,
      )
    })

    it('mengubah status updating menjadi true selama proses', async () => {
      let resolveRequest

      updateAucationApi.mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
      )

      const store = useAucationsStore()

      const promise =
        store.updateAucation(
          201,
          {},
        )

      expect(store.status.updating).toBe(
        true,
      )

      resolveRequest({
        status: 'success',
      })

      await promise

      expect(store.status.updating).toBe(
        false,
      )
    })
  })

  describe('changeCover', () => {
    it('berhasil mengubah cover', async () => {
      const file = new File(
        ['cover'],
        'cover.jpg',
      )

      const response = {
        status: 'success',
        message: 'Cover updated',
      }

      changeCoverApi.mockResolvedValue(
        response,
      )

      const store = useAucationsStore()

      const result =
        await store.changeCover(
          300,
          file,
        )

      expect(
        changeCoverApi,
      ).toHaveBeenCalledWith(
        300,
        file,
      )

      expect(
        store.status.changingCover,
      ).toBe(false)

      expect(result).toEqual(response)
    })

    it('mengembalikan status changingCover false ketika gagal', async () => {
      const error = new Error(
        'Cover gagal',
      )

      changeCoverApi.mockRejectedValue(error)

      const store = useAucationsStore()

      await expect(
        store.changeCover(
          300,
          new File(
            ['cover'],
            'cover.jpg',
          ),
        ),
      ).rejects.toThrow(
        'Cover gagal',
      )

      expect(
        store.status.changingCover,
      ).toBe(false)
    })
  })

  describe('deleteAucation', () => {
    it('berhasil menghapus lelang', async () => {
      const response = {
        status: 'success',
        message: 'Deleted',
      }

      deleteAucationApi.mockResolvedValue(
        response,
      )

      const store = useAucationsStore()

      const result =
        await store.deleteAucation(400)

      expect(
        deleteAucationApi,
      ).toHaveBeenCalledWith(400)

      expect(
        store.status.deleting,
      ).toBe(false)

      expect(result).toEqual(response)
    })

    it('mengembalikan status deleting false ketika gagal', async () => {
      const error = new Error(
        'Delete gagal',
      )

      deleteAucationApi.mockRejectedValue(
        error,
      )

      const store = useAucationsStore()

      await expect(
        store.deleteAucation(400),
      ).rejects.toThrow(
        'Delete gagal',
      )

      expect(
        store.status.deleting,
      ).toBe(false)
    })
  })

  describe('addBid', () => {
    it('berhasil menambahkan bid', async () => {
      const response = {
        status: 'success',
        message: 'Bid added',
      }

      addBidApi.mockResolvedValue(response)

      const store = useAucationsStore()

      const result =
        await store.addBid(
          500,
          2500000,
        )

      expect(
        addBidApi,
      ).toHaveBeenCalledWith(
        500,
        2500000,
      )

      expect(
        store.status.bidding,
      ).toBe(false)

      expect(result).toEqual(response)
    })

    it('mengembalikan status bidding false ketika gagal', async () => {
      const error = new Error(
        'Bid gagal',
      )

      addBidApi.mockRejectedValue(error)

      const store = useAucationsStore()

      await expect(
        store.addBid(
          500,
          2500000,
        ),
      ).rejects.toThrow(
        'Bid gagal',
      )

      expect(
        store.status.bidding,
      ).toBe(false)
    })
  })

  describe('deleteBid', () => {
    it('berhasil menghapus bid', async () => {
      const response = {
        status: 'success',
        message: 'Bid deleted',
      }

      deleteBidApi.mockResolvedValue(
        response,
      )

      const store = useAucationsStore()

      const result =
        await store.deleteBid(600)

      expect(
        deleteBidApi,
      ).toHaveBeenCalledWith(600)

      expect(
        store.status.bidding,
      ).toBe(false)

      expect(result).toEqual(response)
    })

    it('mengembalikan status bidding false ketika gagal', async () => {
      const error = new Error(
        'Delete bid gagal',
      )

      deleteBidApi.mockRejectedValue(error)

      const store = useAucationsStore()

      await expect(
        store.deleteBid(600),
      ).rejects.toThrow(
        'Delete bid gagal',
      )

      expect(
        store.status.bidding,
      ).toBe(false)
    })
  })

  describe('deleteAllAucations', () => {
    it('berhasil menghapus semua lelang', async () => {
      const response = {
        status: 'success',
        message:
          'All aucations deleted',
      }

      deleteAllAucationsApi.mockResolvedValue(
        response,
      )

      const store = useAucationsStore()

      const result =
        await store.deleteAllAucations()

      expect(
        deleteAllAucationsApi,
      ).toHaveBeenCalledTimes(1)

      expect(
        store.status.deleting,
      ).toBe(false)

      expect(result).toEqual(response)
    })

    it('mengembalikan status deleting false ketika gagal', async () => {
      const error = new Error(
        'Delete all gagal',
      )

      deleteAllAucationsApi.mockRejectedValue(
        error,
      )

      const store = useAucationsStore()

      await expect(
        store.deleteAllAucations(),
      ).rejects.toThrow(
        'Delete all gagal',
      )

      expect(
        store.status.deleting,
      ).toBe(false)
    })
  })
})