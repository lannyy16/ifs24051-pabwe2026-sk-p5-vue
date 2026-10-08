import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  getAccessToken,
  putAccessToken,
  apiFetch,
  toFormData,
} from './apiHelper'

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear()

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            status: 'success',
            data: {},
          }),
      }),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAccessToken', () => {
    it('mengembalikan token jika tersedia', () => {
      localStorage.setItem(
        'access_token',
        'token-123',
      )

      expect(getAccessToken()).toBe(
        'token-123',
      )
    })

    it('mengembalikan string kosong jika token tidak tersedia', () => {
      expect(getAccessToken()).toBe('')
    })
  })

  describe('putAccessToken', () => {
    it('menyimpan token ke localStorage', () => {
      putAccessToken('token-123')

      expect(
        localStorage.getItem('access_token'),
      ).toBe('token-123')
    })

    it('menghapus token jika token kosong', () => {
      localStorage.setItem(
        'access_token',
        'token-123',
      )

      putAccessToken('')

      expect(
        localStorage.getItem('access_token'),
      ).toBeNull()
    })

    it('menghapus token jika token null', () => {
      localStorage.setItem(
        'access_token',
        'token-123',
      )

      putAccessToken(null)

      expect(
        localStorage.getItem('access_token'),
      ).toBeNull()
    })
  })

  describe('apiFetch', () => {
    it('melakukan GET request tanpa query parameter', async () => {
      await apiFetch('/users')

      expect(fetch).toHaveBeenCalledTimes(1)

      const [url, options] =
        fetch.mock.calls[0]

      expect(url).toBe(
        'https://open-api.delcom.org/api/v1/users',
      )

      expect(options.method).toBe('GET')
    })

    it('menambahkan query parameter yang valid', async () => {
      await apiFetch('/aucations', {
        query: {
          is_me: 1,
          is_closed: 1,
          empty: '',
          nullValue: null,
          undefinedValue: undefined,
        },
      })

      const [url] =
        fetch.mock.calls[0]

      expect(url).toBe(
        'https://open-api.delcom.org/api/v1/aucations?is_me=1&is_closed=1',
      )
    })

    it('mengubah query value menjadi string', async () => {
      await apiFetch('/users', {
        query: {
          page: 1,
          active: true,
        },
      })

      const [url] =
        fetch.mock.calls[0]

      expect(url).toContain('page=1')
      expect(url).toContain(
        'active=true',
      )
    })

    it('mengirim Authorization header jika token tersedia', async () => {
      localStorage.setItem(
        'access_token',
        'token-123',
      )

      await apiFetch('/users')

      const [, options] =
        fetch.mock.calls[0]

      expect(
        options.headers.get(
          'Authorization',
        ),
      ).toBe('Bearer token-123')
    })

    it('tidak mengirim Authorization header jika token tidak tersedia', async () => {
      await apiFetch('/users')

      const [, options] =
        fetch.mock.calls[0]

      expect(
        options.headers.has(
          'Authorization',
        ),
      ).toBe(false)
    })

    it('menambahkan Content-Type application/json untuk body biasa', async () => {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Karina',
        }),
      })

      const [, options] =
        fetch.mock.calls[0]

      expect(
        options.headers.get(
          'Content-Type',
        ),
      ).toBe('application/json')
    })

    it('tidak mengganti Content-Type custom', async () => {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Karina',
        }),
        headers: {
          'Content-Type':
            'application/custom',
        },
      })

      const [, options] =
        fetch.mock.calls[0]

      expect(
        options.headers.get(
          'Content-Type',
        ),
      ).toBe('application/custom')
    })

    it('tidak menambahkan Content-Type untuk FormData', async () => {
      const formData = new FormData()

      formData.append(
        'name',
        'Karina',
      )

      await apiFetch('/users', {
        method: 'POST',
        body: formData,
      })

      const [, options] =
        fetch.mock.calls[0]

      expect(
        options.headers.has(
          'Content-Type',
        ),
      ).toBe(false)

      expect(options.body).toBe(
        formData,
      )
    })

    it('tidak menambahkan Content-Type jika tidak ada body', async () => {
      await apiFetch('/users', {
        method: 'GET',
      })

      const [, options] =
        fetch.mock.calls[0]

      expect(
        options.headers.has(
          'Content-Type',
        ),
      ).toBe(false)
    })

    it('mengirim method dan body sesuai options', async () => {
      const body = JSON.stringify({
        title: 'Laptop',
      })

      await apiFetch('/aucations', {
        method: 'POST',
        body,
      })

      const [, options] =
        fetch.mock.calls[0]

      expect(options.method).toBe(
        'POST',
      )

      expect(options.body).toBe(body)
    })

    it('mengembalikan data JSON ketika response berhasil', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              status: 'success',
              data: {
                name: 'Karina',
              },
            }),
        }),
      )

      const result =
        await apiFetch('/users')

      expect(result).toEqual({
        status: 'success',
        data: {
          name: 'Karina',
        },
      })
    })

    it('mengembalikan null jika response bukan JSON', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 204,
          json: () =>
            Promise.reject(
              new Error('Not JSON'),
            ),
        }),
      )

      const result =
        await apiFetch('/users')

      expect(result).toBeNull()
    })

    it('melempar error menggunakan message dari response', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              message:
                'Data tidak valid',
            }),
        }),
      )

      await expect(
        apiFetch('/users'),
      ).rejects.toThrow(
        'Data tidak valid',
      )
    })

    it('melempar error menggunakan error dari response', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              error: 'Bad request',
            }),
        }),
      )

      await expect(
        apiFetch('/users'),
      ).rejects.toThrow(
        'Bad request',
      )
    })

    it('menggunakan fallback status jika response tidak memiliki message atau error', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () =>
            Promise.resolve({}),
        }),
      )

      await expect(
        apiFetch('/users'),
      ).rejects.toThrow(
        'Request failed with status 500',
      )
    })

    it('menyimpan status dan data pada error HTTP', async () => {
      const responseData = {
        message: 'Unauthorized',
        data: {
          reason: 'Token expired',
        },
      }

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () =>
            Promise.resolve(
              responseData,
            ),
        }),
      )

      try {
        await apiFetch('/users')
      } catch (error) {
        expect(error.status).toBe(
          401,
        )

        expect(error.data).toEqual(
          responseData,
        )
      }
    })

    it('menangani validation error berupa array', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 422,
          json: () =>
            Promise.resolve({
              status: 'fail',
              message:
                'Validasi gagal',
              data: {
                title: [
                  'Title wajib diisi',
                  'Title terlalu pendek',
                ],
              },
            }),
        }),
      )

      await expect(
        apiFetch('/aucations'),
      ).rejects.toThrow(
        'Validasi gagal\ntitle: Title wajib diisi, Title terlalu pendek',
      )
    })

    it('menangani validation error berupa string', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 422,
          json: () =>
            Promise.resolve({
              status: 'fail',
              message:
                'Validasi gagal',
              data: {
                title:
                  'Title wajib diisi',
              },
            }),
        }),
      )

      await expect(
        apiFetch('/aucations'),
      ).rejects.toThrow(
        'Validasi gagal\ntitle: Title wajib diisi',
      )
    })

    it('menggunakan Request gagal jika status fail tanpa message', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 422,
          json: () =>
            Promise.resolve({
              status: 'fail',
              data: {
                title:
                  'Title wajib diisi',
              },
            }),
        }),
      )

      await expect(
        apiFetch('/aucations'),
      ).rejects.toThrow(
        'Request gagal\ntitle: Title wajib diisi',
      )
    })

    it('tidak menambahkan detail jika validation data kosong', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 422,
          json: () =>
            Promise.resolve({
              status: 'fail',
              message:
                'Validasi gagal',
              data: {},
            }),
        }),
      )

      await expect(
        apiFetch('/aucations'),
      ).rejects.toThrow(
        'Validasi gagal',
      )
    })

    it('menangani status fail tanpa data', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 422,
          json: () =>
            Promise.resolve({
              status: 'fail',
              message:
                'Request gagal',
            }),
        }),
      )

      await expect(
        apiFetch('/aucations'),
      ).rejects.toThrow(
        'Request gagal',
      )
    })

    it('menangani status fail tanpa message dan tanpa data', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 422,
          json: () =>
            Promise.resolve({
              status: 'fail',
            }),
        }),
      )

      await expect(
        apiFetch('/aucations'),
      ).rejects.toThrow(
        'Request gagal',
      )
    })

    it('menyimpan status dan data pada validation error', async () => {
      const responseData = {
        status: 'fail',
        message:
          'Validasi gagal',
        data: {
          title:
            'Title wajib diisi',
        },
      }

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 422,
          json: () =>
            Promise.resolve(
              responseData,
            ),
        }),
      )

      try {
        await apiFetch('/aucations')
      } catch (error) {
        expect(error.status).toBe(
          422,
        )

        expect(error.data).toEqual(
          responseData,
        )
      }
    })
  })

  describe('toFormData', () => {
    it('membuat FormData dari object', () => {
      const formData = toFormData({
        title: 'Jeep',
        description: 'Mobil',
        start_bid: 50000000,
      })

      expect(
        formData.get('title'),
      ).toBe('Jeep')

      expect(
        formData.get('description'),
      ).toBe('Mobil')

      expect(
        formData.get('start_bid'),
      ).toBe('50000000')
    })

    it('mengabaikan nilai null dan undefined', () => {
      const formData = toFormData({
        title: 'Jeep',
        empty: null,
        undefinedValue:
          undefined,
      })

      expect(
        formData.get('title'),
      ).toBe('Jeep')

      expect(
        formData.has('empty'),
      ).toBe(false)

      expect(
        formData.has('undefinedValue'),
      ).toBe(false)
    })

    it('menghasilkan FormData kosong jika object kosong', () => {
      const formData = toFormData({})

      expect(
        [...formData.keys()],
      ).toHaveLength(0)
    })
  })
})