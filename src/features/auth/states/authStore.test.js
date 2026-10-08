import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const mocks = vi.hoisted(() => ({
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  logoutApi: vi.fn(),
}))

vi.mock('../../../helpers/apiHelper', () => ({
  getAccessToken: mocks.getAccessToken,
  putAccessToken: mocks.putAccessToken,
}))

vi.mock('../api/authApi', () => ({
  loginApi: mocks.loginApi,
  registerApi: mocks.registerApi,
  logoutApi: mocks.logoutApi,
}))

import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.clearAllMocks()

    mocks.getAccessToken.mockReturnValue('')
  })

  describe('initial state', () => {
    it('mengambil token dari getAccessToken saat store dibuat', () => {
      mocks.getAccessToken.mockReturnValue(
        'initial-token',
      )

      const store = useAuthStore()

      expect(
        store.token,
      ).toBe('initial-token')

      expect(
        store.isAuthenticated,
      ).toBe(true)
    })

    it('memiliki state default ketika tidak ada token', () => {
      const store = useAuthStore()

      expect(store.token).toBe('')
      expect(store.loading).toBe(false)
      expect(store.error).toBe('')
      expect(
        store.isAuthenticated,
      ).toBe(false)
    })

    it('isAuthenticated bernilai false ketika token kosong', () => {
      const store = useAuthStore()

      expect(
        store.isAuthenticated,
      ).toBe(false)

      store.token = 'token-123'

      expect(
        store.isAuthenticated,
      ).toBe(true)
    })
  })

  describe('login', () => {
    it('berhasil melakukan login', async () => {
      const response = {
        status: 'success',
        message: 'Login berhasil',
      }

      mocks.loginApi.mockResolvedValue(
        response,
      )

      mocks.getAccessToken
        .mockReturnValueOnce('')
        .mockReturnValueOnce(
          'token-login',
        )

      const store = useAuthStore()

      const result = await store.login({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        mocks.loginApi,
      ).toHaveBeenCalledWith({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        mocks.getAccessToken,
      ).toHaveBeenCalledTimes(2)

      expect(
        store.token,
      ).toBe('token-login')

      expect(
        store.isAuthenticated,
      ).toBe(true)

      expect(result).toEqual(response)

      expect(store.loading).toBe(false)
      expect(store.error).toBe('')
    })

    it('mengubah loading menjadi true selama proses login', async () => {
      let resolveLogin

      mocks.loginApi.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveLogin = resolve
          }),
      )

      const store = useAuthStore()

      const promise = store.login({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        store.loading,
      ).toBe(true)

      resolveLogin({
        status: 'success',
      })

      await promise

      expect(
        store.loading,
      ).toBe(false)
    })

    it('mengosongkan error ketika login dimulai', async () => {
      mocks.loginApi.mockResolvedValue({
        status: 'success',
      })

      const store = useAuthStore()

      store.error = 'Error sebelumnya'

      await store.login({
        email: 'karina@example.com',
        password: 'password123',
      })

      expect(
        store.error,
      ).toBe('')
    })

    it('menangani error ketika login gagal', async () => {
      const error = new Error(
        'Email atau password salah',
      )

      mocks.loginApi.mockRejectedValue(
        error,
      )

      const store = useAuthStore()

      await expect(
        store.login({
          email: 'karina@example.com',
          password: 'wrong',
        }),
      ).rejects.toThrow(
        'Email atau password salah',
      )

      expect(
        store.error,
      ).toBe('Email atau password salah')

      expect(
        store.loading,
      ).toBe(false)
    })

    it('tetap mengembalikan loading false setelah login gagal', async () => {
      mocks.loginApi.mockRejectedValue(
        new Error('Login gagal'),
      )

      const store = useAuthStore()

      try {
        await store.login({
          email: 'karina@example.com',
          password: 'password',
        })
      } catch {
        // error memang diharapkan
      }

      expect(
        store.loading,
      ).toBe(false)
    })
  })

  describe('register', () => {
    it('berhasil melakukan register', async () => {
      const response = {
        status: 'success',
        message: 'Registrasi berhasil',
      }

      mocks.registerApi.mockResolvedValue(
        response,
      )

      const store = useAuthStore()

      const payload = {
        name: 'Karina',
        email: 'karina@example.com',
        password: 'password123',
      }

      const result =
        await store.register(payload)

      expect(
        mocks.registerApi,
      ).toHaveBeenCalledWith(
        payload,
      )

      expect(result).toEqual(response)

      expect(
        store.loading,
      ).toBe(false)

      expect(
        store.error,
      ).toBe('')
    })

    it('mengubah loading menjadi true selama proses register', async () => {
      let resolveRegister

      mocks.registerApi.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveRegister = resolve
          }),
      )

      const store = useAuthStore()

      const promise = store.register({
        name: 'Karina',
      })

      expect(
        store.loading,
      ).toBe(true)

      resolveRegister({
        status: 'success',
      })

      await promise

      expect(
        store.loading,
      ).toBe(false)
    })

    it('mengosongkan error ketika register dimulai', async () => {
      mocks.registerApi.mockResolvedValue({
        status: 'success',
      })

      const store = useAuthStore()

      store.error = 'Error sebelumnya'

      await store.register({
        name: 'Karina',
      })

      expect(
        store.error,
      ).toBe('')
    })

    it('menangani error ketika register gagal', async () => {
      const error = new Error(
        'Email sudah terdaftar',
      )

      mocks.registerApi.mockRejectedValue(
        error,
      )

      const store = useAuthStore()

      await expect(
        store.register({
          name: 'Karina',
          email: 'karina@example.com',
        }),
      ).rejects.toThrow(
        'Email sudah terdaftar',
      )

      expect(
        store.error,
      ).toBe('Email sudah terdaftar')

      expect(
        store.loading,
      ).toBe(false)
    })

    it('tetap mengembalikan loading false setelah register gagal', async () => {
      mocks.registerApi.mockRejectedValue(
        new Error('Register gagal'),
      )

      const store = useAuthStore()

      try {
        await store.register({
          name: 'Karina',
        })
      } catch {
        // error memang diharapkan
      }

      expect(
        store.loading,
      ).toBe(false)
    })
  })

  describe('logout', () => {
    it('berhasil melakukan logout', async () => {
      mocks.getAccessToken.mockReturnValue(
        'token-login',
      )

      mocks.logoutApi.mockResolvedValue({
        status: 'success',
      })

      const store = useAuthStore()

      expect(
        store.isAuthenticated,
      ).toBe(true)

      await store.logout()

      expect(
        mocks.logoutApi,
      ).toHaveBeenCalledTimes(1)

      expect(store.token).toBe('')

      expect(
        store.isAuthenticated,
      ).toBe(false)

      expect(
        mocks.putAccessToken,
      ).toHaveBeenCalledWith('')
    })

    it('memanggil logoutApi sebelum menghapus token', async () => {
      const callOrder = []

      mocks.logoutApi.mockImplementation(
        async () => {
          callOrder.push('logoutApi')
        },
      )

      mocks.putAccessToken.mockImplementation(
        () => {
          callOrder.push(
            'putAccessToken',
          )
        },
      )

      const store = useAuthStore()

      store.token = 'token-123'

      await store.logout()

      expect(callOrder).toEqual([
        'logoutApi',
        'putAccessToken',
      ])
    })

    it('melempar error jika logoutApi gagal', async () => {
      const error = new Error(
        'Logout gagal',
      )

      mocks.logoutApi.mockRejectedValue(
        error,
      )

      const store = useAuthStore()

      store.token = 'token-123'

      await expect(
        store.logout(),
      ).rejects.toThrow('Logout gagal')

      expect(
        store.token,
      ).toBe('token-123')

      expect(
        mocks.putAccessToken,
      ).not.toHaveBeenCalled()
    })
  })
})