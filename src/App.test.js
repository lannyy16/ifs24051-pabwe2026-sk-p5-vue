import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/vue'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'

import App from './App.vue'
import { createAppRouter } from './router'
import * as authApi from './features/auth/api/authApi'
import * as userApi from './features/users/api/userApi'
import * as aucationApi from './features/aucations/api/aucationApi'
import { getAccessToken } from './helpers/apiHelper'
import { makeAucation } from './test-utils'

vi.mock('./features/auth/api/authApi')
vi.mock('./features/users/api/userApi')
vi.mock('./features/aucations/api/aucationApi')

const mountApp = async (path) => {
  const router = createAppRouter(createMemoryHistory())

  await router.push(path)
  await router.isReady()

  render(App, {
    global: {
      plugins: [createPinia(), router],
    },
  })

  return router
}

describe('App (integrasi)', () => {
  beforeEach(() => {
    localStorage.clear()

    authApi.login.mockResolvedValue({
      status: 'success',
      data: { token: 'TOK' },
    })

    authApi.logout.mockResolvedValue({
      status: 'success',
    })

    userApi.getProfile.mockResolvedValue({
      status: 'success',
      data: {
        user: {
          id: 1,
          name: 'Abdullah Ubaid',
          photo: '',
        },
      },
    })

    userApi.getUsers.mockResolvedValue({
      status: 'success',
      data: { users: [] },
    })

    aucationApi.getAucations.mockResolvedValue({
      status: 'success',
      data: {
        aucations: [
          makeAucation({
            title: 'Oculus Quest 2',
            user_id: 9,
          }),
        ],
      },
    })
  })

  it(
    'alur lengkap: login -> dashboard -> pengguna -> logout',
    async () => {
      const router = await mountApp('/')

      expect(
        await screen.findByText('Masuk ke akunmu'),
      ).toBeInTheDocument()

      await fireEvent.update(
        screen.getByLabelText('Email'),
        'a@b.co',
      )

      await fireEvent.update(
        screen.getByLabelText('Kata sandi'),
        'rahasia',
      )

      await fireEvent.click(
        screen.getByRole('button', {
          name: 'Masuk',
        }),
      )

      expect(
        await screen.findByRole('heading', {
          name: 'Dashboard Lelang',
        }),
      ).toBeInTheDocument()

      expect(
        await screen.findByText('Oculus Quest 2'),
      ).toBeInTheDocument()

      expect(getAccessToken()).toBe('TOK')

      await fireEvent.click(
        screen.getByRole('link', {
          name: 'Daftar Pengguna',
        }),
      )

      expect(
        await screen.findByText(
          'Belum ada pengguna terdaftar.',
        ),
      ).toBeInTheDocument()

      await fireEvent.click(
        screen.getByRole('button', {
          name: /keluar/i,
        }),
      )

      await waitFor(() => {
        expect(router.currentRoute.value.path).toBe(
          '/auth/login',
        )
      })

      expect(getAccessToken()).toBeNull()

      expect(
        localStorage.getItem('access_token'),
      ).toBeNull()
    },
    10000,
  )

  it('rute tidak dikenal menampilkan halaman 404', async () => {
    await mountApp('/tidak-ada')

    expect(
      await screen.findByText('Halaman tidak ditemukan'),
    ).toBeInTheDocument()
  })
})