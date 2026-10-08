import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  apiFetch,
  toFormData,
} from '../../../helpers/apiHelper'

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
} from './aucationApi'

vi.mock('../../../helpers/apiHelper', () => ({
  apiFetch: vi.fn(),
  toFormData: vi.fn(),
}))

describe('aucationApi', () => {
  describe('getAucationsApi', () => {
    it('memanggil apiFetch dengan endpoint dan query', async () => {
      const query = {
        is_closed: 1,
        search: 'Laptop',
      }

      const response = {
        status: 'success',
        data: {
          aucations: [],
        },
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await getAucationsApi(query)

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      expect(apiFetch).toHaveBeenCalledWith(
        '/aucations',
        {
          query,
        },
      )

      expect(result).toEqual(response)
    })

    it('menggunakan query kosong secara default', async () => {
      const response = {
        status: 'success',
        data: {
          aucations: [],
        },
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await getAucationsApi()

      expect(apiFetch).toHaveBeenCalledWith(
        '/aucations',
        {
          query: {},
        },
      )

      expect(result).toEqual(response)
    })
  })

  describe('getAucationApi', () => {
    it('memanggil endpoint detail aucation berdasarkan id', async () => {
      const response = {
        status: 'success',
        data: {
          aucation: {
            id: 10,
            title: 'Laptop',
          },
        },
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await getAucationApi(10)

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      expect(apiFetch).toHaveBeenCalledWith(
        '/aucations/10',
      )

      expect(result).toEqual(response)
    })

    it('meneruskan id dalam bentuk string', async () => {
      apiFetch.mockResolvedValue({
        status: 'success',
      })

      await getAucationApi('abc')

      expect(apiFetch).toHaveBeenCalledWith(
        '/aucations/abc',
      )
    })
  })

  describe('addAucationApi', () => {
    it('memanggil endpoint add dengan POST dan payload JSON', async () => {
      const payload = {
        title: 'Laptop Gaming',
        description:
          'Laptop untuk dilelang',
        start_bid: '15000000',
        closed_at:
          '2026-10-10 20:00:00',
      }

      const response = {
        status: 'success',
        data: {
          aucation_id: 20,
        },
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await addAucationApi(payload)

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      const [
        endpoint,
        options,
      ] = apiFetch.mock.calls[0]

      expect(endpoint).toBe(
        '/aucations',
      )

      expect(options.method).toBe(
        'POST',
      )

      expect(options.body).toBe(
        JSON.stringify({
          title: 'Laptop Gaming',
          description:
            'Laptop untuk dilelang',
          start_bid: 15000000,
          closed_at:
            '2026-10-10 20:00:00',
        }),
      )

      expect(result).toEqual(response)
    })

    it('mengubah start_bid menjadi number', async () => {
      apiFetch.mockResolvedValue({
        status: 'success',
      })

      await addAucationApi({
        title: 'Barang',
        description: 'Deskripsi',
        start_bid: '500000',
        closed_at: '2026-10-10',
      })

      const [
        ,
        options,
      ] = apiFetch.mock.calls[0]

      expect(
        JSON.parse(options.body),
      ).toEqual({
        title: 'Barang',
        description: 'Deskripsi',
        start_bid: 500000,
        closed_at: '2026-10-10',
      })
    })
  })

  describe('updateAucationApi', () => {
    it('memanggil endpoint update dengan PUT', async () => {
      const payload = {
        title: 'Laptop Updated',
        description:
          'Deskripsi updated',
        start_bid: '20000000',
        closed_at:
          '2026-10-15 20:00:00',
      }

      const response = {
        status: 'success',
        message: 'Updated',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await updateAucationApi(
          20,
          payload,
        )

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      const [
        endpoint,
        options,
      ] = apiFetch.mock.calls[0]

      expect(endpoint).toBe(
        '/aucations/20',
      )

      expect(options.method).toBe(
        'PUT',
      )

      expect(options.body).toBe(
        JSON.stringify({
          title: 'Laptop Updated',
          description:
            'Deskripsi updated',
          start_bid: 20000000,
          closed_at:
            '2026-10-15 20:00:00',
        }),
      )

      expect(result).toEqual(response)
    })

    it('mengubah start_bid menjadi number', async () => {
      apiFetch.mockResolvedValue({
        status: 'success',
      })

      await updateAucationApi(
        '25',
        {
          title: 'Barang',
          description: 'Deskripsi',
          start_bid: '750000',
          closed_at: '2026-10-20',
        },
      )

      const [
        ,
        options,
      ] = apiFetch.mock.calls[0]

      expect(
        JSON.parse(options.body),
      ).toEqual({
        title: 'Barang',
        description: 'Deskripsi',
        start_bid: 750000,
        closed_at: '2026-10-20',
      })
    })
  })

  describe('changeCoverApi', () => {
    it('membuat FormData dan mengirim cover dengan POST', async () => {
      const file = new File(
        ['cover'],
        'cover.jpg',
        {
          type: 'image/jpeg',
        },
      )

      const formData = new FormData()

      formData.append(
        'cover',
        file,
      )

      toFormData.mockReturnValue(
        formData,
      )

      const response = {
        status: 'success',
        message: 'Cover updated',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await changeCoverApi(
          30,
          file,
        )

      expect(
        toFormData,
      ).toHaveBeenCalledTimes(1)

      expect(
        toFormData,
      ).toHaveBeenCalledWith({
        cover: file,
      })

      expect(apiFetch).toHaveBeenCalledWith(
        '/aucations/30/cover',
        {
          method: 'POST',
          body: formData,
        },
      )

      expect(result).toEqual(response)
    })
  })

  describe('deleteAucationApi', () => {
    it('memanggil endpoint delete dengan DELETE', async () => {
      const response = {
        status: 'success',
        message: 'Deleted',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await deleteAucationApi(40)

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      expect(apiFetch).toHaveBeenCalledWith(
        '/aucations/40',
        {
          method: 'DELETE',
        },
      )

      expect(result).toEqual(response)
    })
  })

  describe('addBidApi', () => {
    it('memanggil endpoint bid dengan POST', async () => {
      const response = {
        status: 'success',
        message: 'Bid added',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await addBidApi(
          50,
          '2500000',
        )

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      const [
        endpoint,
        options,
      ] = apiFetch.mock.calls[0]

      expect(endpoint).toBe(
        '/aucations/50/bids',
      )

      expect(options.method).toBe(
        'POST',
      )

      expect(options.body).toBe(
        JSON.stringify({
          bid: 2500000,
        }),
      )

      expect(result).toEqual(response)
    })

    it('mengubah bid menjadi number', async () => {
      apiFetch.mockResolvedValue({
        status: 'success',
      })

      await addBidApi(
        51,
        '3000000',
      )

      const [
        ,
        options,
      ] = apiFetch.mock.calls[0]

      expect(
        JSON.parse(options.body),
      ).toEqual({
        bid: 3000000,
      })
    })
  })

  describe('deleteBidApi', () => {
    it('memanggil endpoint delete bid dengan DELETE', async () => {
      const response = {
        status: 'success',
        message: 'Bid deleted',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await deleteBidApi(60)

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      expect(apiFetch).toHaveBeenCalledWith(
        '/aucations/60/bids',
        {
          method: 'DELETE',
        },
      )

      expect(result).toEqual(response)
    })
  })

  describe('deleteAllAucationsApi', () => {
    it('memanggil endpoint delete semua aucation', async () => {
      const response = {
        status: 'success',
        message:
          'All aucations deleted',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await deleteAllAucationsApi()

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      expect(apiFetch).toHaveBeenCalledWith(
        '/aucations',
        {
          method: 'DELETE',
        },
      )

      expect(result).toEqual(response)
    })
  })

  describe('error handling', () => {
    it('meneruskan error dari getAucationsApi', async () => {
      const error = new Error(
        'Gagal mengambil lelang',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        getAucationsApi(),
      ).rejects.toThrow(
        'Gagal mengambil lelang',
      )
    })

    it('meneruskan error dari getAucationApi', async () => {
      const error = new Error(
        'Lelang tidak ditemukan',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        getAucationApi(1),
      ).rejects.toThrow(
        'Lelang tidak ditemukan',
      )
    })

    it('meneruskan error dari addAucationApi', async () => {
      const error = new Error(
        'Gagal menambahkan lelang',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        addAucationApi({
          title: 'Barang',
          description: 'Deskripsi',
          start_bid: 100000,
          closed_at:
            '2026-10-10',
        }),
      ).rejects.toThrow(
        'Gagal menambahkan lelang',
      )
    })

    it('meneruskan error dari updateAucationApi', async () => {
      const error = new Error(
        'Gagal update lelang',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        updateAucationApi(
          1,
          {
            title: 'Barang',
            description:
              'Deskripsi',
            start_bid: 100000,
            closed_at:
              '2026-10-10',
          },
        ),
      ).rejects.toThrow(
        'Gagal update lelang',
      )
    })

    it('meneruskan error dari changeCoverApi', async () => {
      const error = new Error(
        'Gagal upload cover',
      )

      apiFetch.mockRejectedValue(error)

      toFormData.mockReturnValue(
        new FormData(),
      )

      const file = new File(
        ['cover'],
        'cover.jpg',
      )

      await expect(
        changeCoverApi(1, file),
      ).rejects.toThrow(
        'Gagal upload cover',
      )
    })

    it('meneruskan error dari deleteAucationApi', async () => {
      const error = new Error(
        'Gagal menghapus lelang',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        deleteAucationApi(1),
      ).rejects.toThrow(
        'Gagal menghapus lelang',
      )
    })

    it('meneruskan error dari addBidApi', async () => {
      const error = new Error(
        'Gagal menambahkan bid',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        addBidApi(1, 100000),
      ).rejects.toThrow(
        'Gagal menambahkan bid',
      )
    })

    it('meneruskan error dari deleteBidApi', async () => {
      const error = new Error(
        'Gagal menghapus bid',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        deleteBidApi(1),
      ).rejects.toThrow(
        'Gagal menghapus bid',
      )
    })

    it('meneruskan error dari deleteAllAucationsApi', async () => {
      const error = new Error(
        'Gagal menghapus semua lelang',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        deleteAllAucationsApi(),
      ).rejects.toThrow(
        'Gagal menghapus semua lelang',
      )
    })
  })
})