import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const {
  apiFetchMock,
  getAccessTokenMock,
  putAccessTokenMock,
  toFormDataMock,
} = vi.hoisted(() => ({
  apiFetchMock: vi.fn(),
  getAccessTokenMock: vi.fn(),
  putAccessTokenMock: vi.fn(),
  toFormDataMock: vi.fn(),
}))

vi.mock(
  '../../../helpers/apiHelper',
  () => ({
    apiFetch: apiFetchMock,
    getAccessToken:
      getAccessTokenMock,
    putAccessToken:
      putAccessTokenMock,
    toFormData: toFormDataMock,
  }),
)

import {
  registerApi,
  loginApi,
  logoutApi,
  register,
  login,
  logout,
} from './authApi'

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    toFormDataMock.mockImplementation(
      (data) => {
        return {
          __formData: data,
        }
      },
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('registerApi', () => {
    it('mengirim data register menggunakan FormData', async () => {
      const data = {
        name: 'Karina Putri Sion',
        email: 'karina@example.com',
        password: 'password123',
      }

      const formData = {
        __formData: data,
      }

      toFormDataMock.mockReturnValue(
        formData,
      )

      apiFetchMock.mockResolvedValue({
        status: 'success',
        data: {
          user_id: 1,
        },
      })

      const result =
        await registerApi(data)

      expect(
        toFormDataMock,
      ).toHaveBeenCalledWith({
        name: 'Karina Putri Sion',
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        apiFetchMock,
      ).toHaveBeenCalledWith(
        '/auth/register',
        {
          method: 'POST',
          body: formData,
        },
      )

      expect(result).toEqual({
        status: 'success',
        data: {
          user_id: 1,
        },
      })
    })

    it('meneruskan error dari apiFetch', async () => {
      const error = new Error(
        'Register gagal',
      )

      apiFetchMock.mockRejectedValue(
        error,
      )

      await expect(
        registerApi({
          name: 'Karina',
          email: 'karina@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(
        'Register gagal',
      )
    })
  })

  describe('loginApi', () => {
    it('mengirim email dan password menggunakan FormData', async () => {
      const data = {
        email: 'karina@example.com',
        password: 'password123',
      }

      const formData = {
        __formData: data,
      }

      toFormDataMock.mockReturnValue(
        formData,
      )

      apiFetchMock.mockResolvedValue({
        status: 'success',
        data: {
          token: 'token-123',
        },
      })

      const result =
        await loginApi(data)

      expect(
        toFormDataMock,
      ).toHaveBeenCalledWith({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        apiFetchMock,
      ).toHaveBeenCalledWith(
        '/auth/login',
        {
          method: 'POST',
          body: formData,
        },
      )

      expect(
        putAccessTokenMock,
      ).toHaveBeenCalledWith(
        'token-123',
      )

      expect(result).toEqual({
        status: 'success',
        data: {
          token: 'token-123',
        },
      })
    })

    it('mengambil token dari response.token', async () => {
      apiFetchMock.mockResolvedValue({
        status: 'success',
        token: 'token-root',
      })

      await loginApi({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        putAccessTokenMock,
      ).toHaveBeenCalledWith(
        'token-root',
      )
    })

    it('mengambil token dari data.access_token', async () => {
      apiFetchMock.mockResolvedValue({
        status: 'success',
        data: {
          access_token:
            'token-access',
        },
      })

      await loginApi({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        putAccessTokenMock,
      ).toHaveBeenCalledWith(
        'token-access',
      )
    })

    it('mengambil token dari response.access_token', async () => {
      apiFetchMock.mockResolvedValue({
        status: 'success',
        access_token:
          'token-root-access',
      })

      await loginApi({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        putAccessTokenMock,
      ).toHaveBeenCalledWith(
        'token-root-access',
      )
    })

    it('tidak menyimpan token jika response tidak memiliki token', async () => {
      apiFetchMock.mockResolvedValue({
        status: 'success',
        data: {},
      })

      await loginApi({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        putAccessTokenMock,
      ).not.toHaveBeenCalled()
    })

    it('tidak menyimpan token jika response null', async () => {
      apiFetchMock.mockResolvedValue(
        null,
      )

      const result = await loginApi({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(result).toBeNull()

      expect(
        putAccessTokenMock,
      ).not.toHaveBeenCalled()
    })

    it('meneruskan error dari apiFetch', async () => {
      const error = new Error(
        'Login gagal',
      )

      apiFetchMock.mockRejectedValue(
        error,
      )

      await expect(
        loginApi({
          email: 'karina@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(
        'Login gagal',
      )
    })
  })

  describe('logoutApi', () => {
    it('menghapus token jika token tersedia', async () => {
      getAccessTokenMock.mockReturnValue(
        'token-123',
      )

      const result =
        await logoutApi()

      expect(
        getAccessTokenMock,
      ).toHaveBeenCalled()

      expect(
        putAccessTokenMock,
      ).toHaveBeenCalledWith(null)

      expect(result).toEqual({
        success: true,
        message: 'Berhasil logout',
      })
    })

    it('tidak menghapus token jika token tidak tersedia', async () => {
      getAccessTokenMock.mockReturnValue(
        '',
      )

      const result =
        await logoutApi()

      expect(
        getAccessTokenMock,
      ).toHaveBeenCalled()

      expect(
        putAccessTokenMock,
      ).not.toHaveBeenCalled()

      expect(result).toEqual({
        success: true,
        message: 'Berhasil logout',
      })
    })
  })

  describe('alias', () => {
    it('register adalah alias registerApi', () => {
      expect(register).toBe(
        registerApi,
      )
    })

    it('login adalah alias loginApi', () => {
      expect(login).toBe(loginApi)
    })

    it('logout adalah alias logoutApi', () => {
      expect(logout).toBe(logoutApi)
    })
  })
})