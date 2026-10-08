import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { createPinia, setActivePinia } from 'pinia'

import {
  getUsersApi,
  getMeApi,
  updateMeApi,
  updatePhotoApi,
  updatePasswordApi,
} from '../api/userApi'

import { useUsersStore } from './usersStore'

vi.mock('../api/userApi', () => ({
  getUsersApi: vi.fn(),
  getMeApi: vi.fn(),
  updateMeApi: vi.fn(),
  updatePhotoApi: vi.fn(),
  updatePasswordApi: vi.fn(),
}))

describe('usersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('memiliki state awal yang benar', () => {
      const store = useUsersStore()

      expect(store.users).toEqual([])
      expect(store.me).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBe('')
    })
  })

  describe('fetchUsers', () => {
    it('berhasil mengambil daftar users', async () => {
      const response = {
        status: 'success',
        data: [
          {
            id: 1,
            name: 'Karina',
          },
          {
            id: 2,
            name: 'Niken',
          },
        ],
      }

      getUsersApi.mockResolvedValue(response)

      const store = useUsersStore()

      const result =
        await store.fetchUsers({
          page: 1,
        })

      expect(getUsersApi).toHaveBeenCalledTimes(
        1,
      )

      expect(getUsersApi).toHaveBeenCalledWith({
        page: 1,
      })

      expect(store.users).toEqual(
        response.data,
      )

      expect(store.loading).toBe(false)
      expect(store.error).toBe('')

      expect(result).toEqual(response)
    })

    it('menggunakan query kosong jika tidak diberikan', async () => {
      const response = {
        status: 'success',
        data: [],
      }

      getUsersApi.mockResolvedValue(response)

      const store = useUsersStore()

      await store.fetchUsers()

      expect(getUsersApi).toHaveBeenCalledWith(
        {},
      )

      expect(store.users).toEqual([])
      expect(store.loading).toBe(false)
    })

    it('menangani response tanpa data', async () => {
      const response = {
        status: 'success',
      }

      getUsersApi.mockResolvedValue(response)

      const store = useUsersStore()

      await store.fetchUsers()

      expect(store.users).toEqual([])
      expect(store.loading).toBe(false)
    })

    it('menangani error ketika mengambil users', async () => {
      const error = new Error(
        'Gagal mengambil users',
      )

      getUsersApi.mockRejectedValue(error)

      const store = useUsersStore()

      await expect(
        store.fetchUsers(),
      ).rejects.toThrow(
        'Gagal mengambil users',
      )

      expect(store.error).toBe(
        'Gagal mengambil users',
      )

      expect(store.loading).toBe(false)
    })

    it('menghapus error lama sebelum fetch users', async () => {
      const store = useUsersStore()

      store.error = 'Error lama'

      getUsersApi.mockResolvedValue({
        status: 'success',
        data: [],
      })

      await store.fetchUsers()

      expect(store.error).toBe('')
    })
  })

  describe('fetchMe', () => {
    it('berhasil mengambil data user sendiri', async () => {
      const response = {
        status: 'success',
        data: {
          id: 1,
          name: 'Karina',
          username: 'karina',
        },
      }

      getMeApi.mockResolvedValue(response)

      const store = useUsersStore()

      const result =
        await store.fetchMe()

      expect(getMeApi).toHaveBeenCalledTimes(
        1,
      )

      expect(store.me).toEqual(
        response.data,
      )

      expect(store.loading).toBe(false)
      expect(store.error).toBe('')

      expect(result).toEqual(response)
    })

    it('menangani response tanpa data', async () => {
      const response = {
        status: 'success',
      }

      getMeApi.mockResolvedValue(response)

      const store = useUsersStore()

      await store.fetchMe()

      expect(store.me).toBeNull()
      expect(store.loading).toBe(false)
    })

    it('menangani error ketika mengambil profile', async () => {
      const error = new Error(
        'Gagal mengambil profile',
      )

      getMeApi.mockRejectedValue(error)

      const store = useUsersStore()

      await expect(
        store.fetchMe(),
      ).rejects.toThrow(
        'Gagal mengambil profile',
      )

      expect(store.error).toBe(
        'Gagal mengambil profile',
      )

      expect(store.loading).toBe(false)
    })

    it('menghapus error lama sebelum fetch profile', async () => {
      const store = useUsersStore()

      store.error = 'Error lama'

      getMeApi.mockResolvedValue({
        status: 'success',
        data: {
          id: 1,
        },
      })

      await store.fetchMe()

      expect(store.error).toBe('')
    })
  })

  describe('updateMe', () => {
    it('berhasil mengupdate profile dan mengganti data me', async () => {
      const payload = {
        name: 'Karina Baru',
      }

      const response = {
        status: 'success',
        data: {
          id: 1,
          name: 'Karina Baru',
        },
      }

      updateMeApi.mockResolvedValue(response)

      const store = useUsersStore()

      const result =
        await store.updateMe(payload)

      expect(updateMeApi).toHaveBeenCalledTimes(
        1,
      )

      expect(updateMeApi).toHaveBeenCalledWith(
        payload,
      )

      expect(store.me).toEqual(
        response.data,
      )

      expect(result).toEqual(response)
    })

    it('mempertahankan data me jika response tidak memiliki data', async () => {
      const oldMe = {
        id: 1,
        name: 'Karina',
      }

      const store = useUsersStore()

      store.me = oldMe

      const response = {
        status: 'success',
      }

      updateMeApi.mockResolvedValue(response)

      const result =
        await store.updateMe({
          name: 'Karina Baru',
        })

      expect(store.me).toEqual(oldMe)
      expect(result).toEqual(response)
    })
  })

  describe('updatePhoto', () => {
    it('berhasil mengupdate photo dan mengganti data me', async () => {
      const file = new File(
        ['photo'],
        'photo.jpg',
        {
          type: 'image/jpeg',
        },
      )

      const response = {
        status: 'success',
        data: {
          id: 1,
          name: 'Karina',
          photo: 'photo.jpg',
        },
      }

      updatePhotoApi.mockResolvedValue(
        response,
      )

      const store = useUsersStore()

      const result =
        await store.updatePhoto(file)

      expect(
        updatePhotoApi,
      ).toHaveBeenCalledTimes(1)

      expect(
        updatePhotoApi,
      ).toHaveBeenCalledWith(file)

      expect(store.me).toEqual(
        response.data,
      )

      expect(result).toEqual(response)
    })

    it('mempertahankan data me jika response tidak memiliki data', async () => {
      const oldMe = {
        id: 1,
        name: 'Karina',
      }

      const store = useUsersStore()

      store.me = oldMe

      updatePhotoApi.mockResolvedValue({
        status: 'success',
      })

      const file = new File(
        ['photo'],
        'photo.jpg',
      )

      const result =
        await store.updatePhoto(file)

      expect(store.me).toEqual(oldMe)
      expect(result).toEqual({
        status: 'success',
      })
    })
  })

  describe('updatePassword', () => {
    it('memanggil updatePasswordApi dengan payload', async () => {
      const payload = {
        current_password:
          'password-lama',
        new_password:
          'password-baru',
      }

      const response = {
        status: 'success',
        message:
          'Password berhasil diubah',
      }

      updatePasswordApi.mockResolvedValue(
        response,
      )

      const store = useUsersStore()

      const result =
        await store.updatePassword(
          payload,
        )

      expect(
        updatePasswordApi,
      ).toHaveBeenCalledTimes(1)

      expect(
        updatePasswordApi,
      ).toHaveBeenCalledWith(
        payload,
      )

      expect(result).toEqual(response)
    })

    it('meneruskan error dari updatePasswordApi', async () => {
      const error = new Error(
        'Password salah',
      )

      updatePasswordApi.mockRejectedValue(
        error,
      )

      const store = useUsersStore()

      await expect(
        store.updatePassword({
          current_password: 'salah',
          new_password: 'baru',
        }),
      ).rejects.toThrow(
        'Password salah',
      )
    })
  })

  describe('loading state', () => {
    it('mengembalikan loading menjadi false setelah fetchUsers berhasil', async () => {
      let resolveRequest

      getUsersApi.mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
      )

      const store = useUsersStore()

      const promise =
        store.fetchUsers()

      expect(store.loading).toBe(true)

      resolveRequest({
        status: 'success',
        data: [],
      })

      await promise

      expect(store.loading).toBe(false)
    })

    it('mengembalikan loading menjadi false setelah fetchMe berhasil', async () => {
      let resolveRequest

      getMeApi.mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
      )

      const store = useUsersStore()

      const promise =
        store.fetchMe()

      expect(store.loading).toBe(true)

      resolveRequest({
        status: 'success',
        data: {
          id: 1,
        },
      })

      await promise

      expect(store.loading).toBe(false)
    })
  })
})