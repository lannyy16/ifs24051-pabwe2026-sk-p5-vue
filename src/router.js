
import { createRouter, createWebHistory } from 'vue-router'
import NotFoundPage from './features/common/pages/NotFoundPage.vue'
import { getAccessToken } from './helpers/apiHelper'

export const routes = [
  {
    path: '/auth',
    component: () =>
      import('./features/auth/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        component: () =>
          import('./features/auth/pages/LoginPage.vue'),
      },
      {
        path: 'register',
        component: () =>
          import('./features/auth/pages/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () =>
      import('./features/aucations/layouts/AucationLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () =>
          import('./features/aucations/pages/HomePage.vue'),
      },
      {
        path: 'aucations/:aucationId',
        component: () =>
          import('./features/aucations/pages/DetailPage.vue'),
      },
      {
        path: 'users',
        component: () =>
          import('./features/users/pages/UsersPage.vue'),
      },
      {
        path: 'profile',
        component: () =>
          import('./features/users/pages/ProfilePage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage,
  },
]

/**
 * Menentukan keputusan autentikasi.
 * Fungsi selalu mengembalikan objek dengan struktur yang sama.
 */
export function authGuard(to) {
  const hasToken = Boolean(getAccessToken())

  if (to.meta.requiresAuth && !hasToken) {
    return { redirectTo: '/auth/login' }
  }

  if (to.meta.guestOnly && hasToken) {
    return { redirectTo: '/' }
  }

  return { redirectTo: null }
}

/**
 * Mengubah keputusan autentikasi menjadi hasil navigation guard.
 * Fungsi selalu mengembalikan Promise.
 */
function navigationGuard(to) {
  const { redirectTo } = authGuard(to)

  return Promise.resolve(redirectTo).then(
    (target) => target ?? true,
  )
}

export function createAppRouter(history) {
  const router = createRouter({
    history,
    routes,
  })

  router.beforeEach(navigationGuard)

  return router
}

export default createAppRouter(createWebHistory())