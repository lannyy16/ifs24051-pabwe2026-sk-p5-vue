import { createRouter, createWebHistory } from 'vue-router'
import NotFoundPage from './features/common/pages/NotFoundPage.vue'
import { getAccessToken } from './helpers/apiHelper'

export const routes = [
  {
    path: '/auth',
    component: () => import('./features/auth/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        component: () => import('./features/auth/pages/LoginPage.vue'),
      },
      {
        path: 'register',
        component: () => import('./features/auth/pages/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('./features/aucations/layouts/AucationLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('./features/aucations/pages/HomePage.vue'),
      },
      {
        path: 'aucations/:aucationId',
        component: () => import('./features/aucations/pages/DetailPage.vue'),
      },
      {
        path: 'users',
        component: () => import('./features/users/pages/UsersPage.vue'),
      },
      {
        path: 'profile',
        component: () => import('./features/users/pages/ProfilePage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage,
  },
]

/**
 * Halaman terproteksi membutuhkan token.
 * Halaman autentikasi hanya dapat diakses oleh tamu.
 */
export function authGuard(to) {
  const hasToken = Boolean(getAccessToken())

  if (to.meta.requiresAuth && !hasToken) {
    return '/auth/login'
  }

  if (to.meta.guestOnly && hasToken) {
    return '/'
  }

  return true
}

export function createAppRouter(history) {
  const router = createRouter({
    history,
    routes,
  })

  router.beforeEach(authGuard)

  return router
}

export default createAppRouter(createWebHistory())