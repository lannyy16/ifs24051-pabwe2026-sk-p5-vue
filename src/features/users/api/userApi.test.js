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
  getUsersApi,
  getMeApi,
  updateMeApi,
  updatePhotoApi,
  updatePasswordApi,
} from './userApi'

vi.mock('../../../helpers/apiHelper', () => ({
  apiFetch: vi.fn(),
  toFormData: vi.fn(),
}))

describe('userApi', () => {
  describe('getUsersApi', () => {
    it('memanggil apiFetch dengan endpoint users dan query', async () => {
      const query = {
        page: 1,
        search: 'Karina',
      }

      const response = {
        status: 'success',
        data: {
          users: [],
        },
      }

      apiFetch.mockResolvedValue(response)

      const result = await getUsersApi(query)

      expect(apiFetch).toHaveBeenCalledTimes(1)

      expect(apiFetch).toHaveBeenCalledWith(
        '/users',
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
          users: [],
        },
      }

      apiFetch.mockResolvedValue(response)

      const result = await getUsersApi()

      expect(apiFetch).toHaveBeenCalledWith(
        '/users',
        {
          query: {},
        },
      )

      expect(result).toEqual(response)
    })
  })

  describe('getMeApi', () => {
    it('memanggil endpoint users/me', async () => {
      const response = {
        status: 'success',
        data: {
          user: {
            id: 1,
            name: 'Karina',
          },
        },
      }

      apiFetch.mockResolvedValue(response)

      const result = await getMeApi()

      expect(apiFetch).toHaveBeenCalledTimes(1)

      expect(apiFetch).toHaveBeenCalledWith(
        '/users/me',
      )

      expect(result).toEqual(response)
    })
  })

  describe('updateMeApi', () => {
    it('memanggil endpoint update profile dengan PUT', async () => {
      const payload = {
        name: 'Karina Putri Sion',
        username: 'karina',
      }

      const response = {
        status: 'success',
        message: 'Profile updated',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await updateMeApi(payload)

      expect(apiFetch).toHaveBeenCalledTimes(1)

      const [
        endpoint,
        options,
      ] = apiFetch.mock.calls[0]

      expect(endpoint).toBe(
        '/users/me',
      )

      expect(options.method).toBe(
        'PUT',
      )

      expect(
        options.body,
      ).toBeInstanceOf(URLSearchParams)

      expect(
        options.body.get('name'),
      ).toBe('Karina Putri Sion')

      expect(
        options.body.get('username'),
      ).toBe('karina')

      expect(result).toEqual(response)
    })

    it('mengirim payload kosong sebagai URLSearchParams', async () => {
      apiFetch.mockResolvedValue({
        status: 'success',
      })

      await updateMeApi({})

      const [
        endpoint,
        options,
      ] = apiFetch.mock.calls[0]

      expect(endpoint).toBe(
        '/users/me',
      )

      expect(options.method).toBe(
        'PUT',
      )

      expect(
        options.body,
      ).toBeInstanceOf(URLSearchParams)

      expect(
        [...options.body.entries()],
      ).toEqual([])
    })
  })

  describe('updatePhotoApi', () => {
    it('membuat FormData photo dan mengirim dengan POST', async () => {
      const file = new File(
        ['photo'],
        'photo.jpg',
        {
          type: 'image/jpeg',
        },
      )

      const formData = new FormData()

      formData.append(
        'photo',
        file,
      )

      toFormData.mockReturnValue(
        formData,
      )

      const response = {
        status: 'success',
        message: 'Photo updated',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await updatePhotoApi(file)

      expect(toFormData).toHaveBeenCalledTimes(
        1,
      )

      expect(
        toFormData,
      ).toHaveBeenCalledWith({
        photo: file,
      })

      expect(apiFetch).toHaveBeenCalledTimes(
        1,
      )

      expect(
        apiFetch,
      ).toHaveBeenCalledWith(
        '/users/me/photo',
        {
          method: 'POST',
          body: formData,
        },
      )

      expect(result).toEqual(response)
    })

    it('tetap menggunakan file yang diberikan', async () => {
      const file = new File(
        ['avatar'],
        'avatar.png',
        {
          type: 'image/png',
        },
      )

      const formData = new FormData()

      toFormData.mockReturnValue(
        formData,
      )

      apiFetch.mockResolvedValue({
        status: 'success',
      })

      await updatePhotoApi(file)

      expect(
        toFormData,
      ).toHaveBeenCalledWith({
        photo: file,
      })
    })
  })

  describe('updatePasswordApi', () => {
    it('memanggil endpoint password dengan PUT', async () => {
      const payload = {
        current_password:
          'password-lama',
        new_password:
          'password-baru',
      }

      const response = {
        status: 'success',
        message:
          'Password updated',
      }

      apiFetch.mockResolvedValue(response)

      const result =
        await updatePasswordApi(
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
        '/users/me/password',
      )

      expect(options.method).toBe(
        'PUT',
      )

      expect(
        options.body,
      ).toBeInstanceOf(URLSearchParams)

      expect(
        options.body.get(
          'current_password',
        ),
      ).toBe('password-lama')

      expect(
        options.body.get(
          'new_password',
        ),
      ).toBe('password-baru')

      expect(result).toEqual(response)
    })

    it('mendukung payload password kosong', async () => {
      apiFetch.mockResolvedValue({
        status: 'success',
      })

      await updatePasswordApi({})

      const [
        endpoint,
        options,
      ] = apiFetch.mock.calls[0]

      expect(endpoint).toBe(
        '/users/me/password',
      )

      expect(options.method).toBe(
        'PUT',
      )

      expect(
        options.body,
      ).toBeInstanceOf(URLSearchParams)

      expect(
        [...options.body.entries()],
      ).toEqual([])
    })
  })

  describe('error handling', () => {
    it('meneruskan error dari getUsersApi', async () => {
      const error = new Error(
        'Gagal mengambil user',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        getUsersApi(),
      ).rejects.toThrow(
        'Gagal mengambil user',
      )
    })

    it('meneruskan error dari getMeApi', async () => {
      const error = new Error(
        'Unauthorized',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        getMeApi(),
      ).rejects.toThrow(
        'Unauthorized',
      )
    })

    it('meneruskan error dari updateMeApi', async () => {
      const error = new Error(
        'Update gagal',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        updateMeApi({
          name: 'Karina',
        }),
      ).rejects.toThrow(
        'Update gagal',
      )
    })

    it('meneruskan error dari updatePhotoApi', async () => {
      const error = new Error(
        'Upload gagal',
      )

      const formData = new FormData()

      toFormData.mockReturnValue(
        formData,
      )

      apiFetch.mockRejectedValue(error)

      const file = new File(
        ['photo'],
        'photo.jpg',
      )

      await expect(
        updatePhotoApi(file),
      ).rejects.toThrow(
        'Upload gagal',
      )
    })

    it('meneruskan error dari updatePasswordApi', async () => {
      const error = new Error(
        'Password salah',
      )

      apiFetch.mockRejectedValue(error)

      await expect(
        updatePasswordApi({
          current_password:
            'salah',
          new_password:
            'baru',
        }),
      ).rejects.toThrow(
        'Password salah',
      )
    })
  })
})