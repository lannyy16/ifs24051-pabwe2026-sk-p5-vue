
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { createMemoryHistory } from 'vue-router'

const { mockGetAccessToken } = vi.hoisted(() => ({
  mockGetAccessToken: vi.fn(),
}))

vi.mock('./helpers/apiHelper', () => ({
  getAccessToken: mockGetAccessToken,
}))

import {
  authGuard,
  createAppRouter,
  routes,
} from './router'

describe('Router', () => {
  beforeEach(() => {
    mockGetAccessToken.mockReset()
    mockGetAccessToken.mockReturnValue(null)
  })

  it('mendefinisikan semua rute aplikasi', () => {
    const authRoute = routes.find(
      (route) => route.path === '/auth',
    )

    const auctionRoute = routes.find(
      (route) => route.path === '/',
    )

    const notFoundRoute = routes.find(
      (route) => route.path === '/:pathMatch(.*)*',
    )

    expect(authRoute).toBeDefined()
    expect(authRoute.redirect).toBe('/auth/login')
    expect(authRoute.children.map((route) => route.path)).toEqual([
      'login',
      'register',
    ])

    expect(auctionRoute).toBeDefined()
    expect(auctionRoute.children.map((route) => route.path)).toEqual([
      '',
      'aucations/:aucationId',
      'users',
      'profile',
    ])

    expect(notFoundRoute).toBeDefined()
  })

  it('mengarahkan pengguna tanpa token ke halaman login', () => {
    mockGetAccessToken.mockReturnValue(null)

    const result = authGuard({
      meta: { requiresAuth: true },
    })

    expect(result).toEqual({
      redirectTo: '/auth/login',
    })
  })

  it('mengarahkan pengguna yang sudah login dari halaman tamu ke home', () => {
    mockGetAccessToken.mockReturnValue('access-token')

    const result = authGuard({
      meta: { guestOnly: true },
    })

    expect(result).toEqual({
      redirectTo: '/',
    })
  })

  it('mengizinkan halaman tamu ketika pengguna belum login', () => {
    mockGetAccessToken.mockReturnValue(null)

    const result = authGuard({
      meta: { guestOnly: true },
    })

    expect(result).toEqual({
      redirectTo: null,
    })
  })

  it('mengizinkan halaman privat ketika pengguna sudah login', () => {
    mockGetAccessToken.mockReturnValue('access-token')

    const result = authGuard({
      meta: { requiresAuth: true },
    })

    expect(result).toEqual({
      redirectTo: null,
    })
  })

  it('membuat router dengan seluruh rute aplikasi', () => {
    const router = createAppRouter(createMemoryHistory())

    expect(router).toBeDefined()

    const registeredPaths = router
      .getRoutes()
      .map((route) => route.path)

    expect(registeredPaths).toContain('/auth/login')
    expect(registeredPaths).toContain('/auth/register')
    expect(registeredPaths).toContain('/')
    expect(registeredPaths).toContain('/aucations/:aucationId')
    expect(registeredPaths).toContain('/users')
    expect(registeredPaths).toContain('/profile')
    expect(registeredPaths).toContain('/:pathMatch(.*)*')
  })

  it('mengalihkan pengguna tanpa token ke login saat membuka home', async () => {
    mockGetAccessToken.mockReturnValue(null)

    const router = createAppRouter(createMemoryHistory())

    await router.push('/')

    expect(router.currentRoute.value.fullPath).toBe('/auth/login')
  })

  it('mengalihkan pengguna yang sudah login dari login ke home', async () => {
    mockGetAccessToken.mockReturnValue('access-token')

    const router = createAppRouter(createMemoryHistory())

    await router.push('/auth/login')

    expect(router.currentRoute.value.fullPath).toBe('/')
  })

  it('memuat halaman autentikasi, halaman privat, dan halaman 404', async () => {
    const router = createAppRouter(createMemoryHistory())

    mockGetAccessToken.mockReturnValue(null)

    await router.push('/auth/login')
    expect(router.currentRoute.value.fullPath).toBe('/auth/login')

    await router.push('/auth/register')
    expect(router.currentRoute.value.fullPath).toBe('/auth/register')

    mockGetAccessToken.mockReturnValue('access-token')

    const privatePaths = [
      '/',
      '/aucations/123',
      '/users',
      '/profile',
    ]

    for (const path of privatePaths) {
      await router.push(path)

      expect(router.currentRoute.value.fullPath).toBe(path)
    }

    await router.push('/halaman-tidak-tersedia')

    expect(router.currentRoute.value.matched.at(-1)?.path).toBe(
      '/:pathMatch(.*)*',
    )
  })
})