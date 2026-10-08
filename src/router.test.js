import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import router, { authGuard, createAppRouter, routes } from './router'
import NotFoundPage from './features/common/pages/NotFoundPage.vue'
import { putAccessToken } from './helpers/apiHelper'

const go = async (path, token = false) => {
  if (token) putAccessToken('TOK')
  const appRouter = createAppRouter(createMemoryHistory())
  await appRouter.push(path)
  await appRouter.isReady()
  return appRouter.currentRoute.value
}

describe('authGuard', () => {
  it('menolak halaman terproteksi tanpa token', () => {
    expect(authGuard({ meta: { requiresAuth: true } })).toBe('/auth/login')
  })
  it('mengizinkan halaman terproteksi dengan token', () => {
    putAccessToken('TOK')
    expect(authGuard({ meta: { requiresAuth: true } })).toBe(true)
  })
  it('mengalihkan tamu-saja ke dashboard jika sudah login', () => {
    putAccessToken('TOK')
    expect(authGuard({ meta: { guestOnly: true } })).toBe('/')
  })
  it('mengizinkan halaman tamu-saja tanpa token dan halaman publik', () => {
    expect(authGuard({ meta: { guestOnly: true } })).toBe(true)
    expect(authGuard({ meta: {} })).toBe(true)
  })
})

describe('router', () => {
  beforeEach(() => localStorage.clear())

  it('mendeklarasikan rute auth, lelang, dan wildcard', () => {
    expect(routes.map((r) => r.path)).toEqual(['/auth', '/', '/:pathMatch(.*)*'])
    expect(routes[0].children.map((r) => r.path)).toEqual(['login', 'register'])
    expect(routes[1].children.map((r) => r.path)).toEqual(['', 'aucations/:aucationId', 'users', 'profile'])
    expect(router.getRoutes().length).toBeGreaterThan(5)
  })

  it('tanpa token, / diarahkan ke login', async () => {
    expect((await go('/')).path).toBe('/auth/login')
    expect((await go('/users')).path).toBe('/auth/login')
  })

  it('/auth diarahkan ke login dan register dapat diakses tamu', async () => {
    expect((await go('/auth')).path).toBe('/auth/login')
    expect((await go('/auth/register')).path).toBe('/auth/register')
  })

  it('dengan token, halaman lelang dapat diakses dan halaman auth ditolak', async () => {
    expect((await go('/aucations/3', true)).params.aucationId).toBe('3')
    expect((await go('/profile', true)).path).toBe('/profile')
    expect((await go('/auth/login', true)).path).toBe('/')
  })

  it('rute tidak dikenal memakai NotFoundPage', async () => {
    const route = await go('/halaman/tidak/ada')
    expect(route.matched[0].components.default).toBe(NotFoundPage)
  })
})
