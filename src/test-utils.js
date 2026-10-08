import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent, h } from 'vue'
import { render } from '@testing-library/vue'

export const Blank = defineComponent({ render: () => h('div', { 'data-testid': 'blank' }) })

/** Pinia baru untuk pengujian; initialState mengisi state awal tiap store. */
export function createMockPinia(initialState = {}) {
  const pinia = createPinia()
  pinia.state.value = initialState
  setActivePinia(pinia)
  return pinia
}

/**
 * Render komponen dengan Pinia + router (memory history).
 * routes default: semua path dirender sebagai komponen kosong.
 */
export async function renderWithProviders(
  component,
  { route = '/', initialState = {}, routes = [{ path: '/:pathMatch(.*)*', component: Blank }], props, slots } = {},
) {
  const pinia = createMockPinia(initialState)
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(route)
  await router.isReady()
  const utils = render(component, { props, slots, global: { plugins: [pinia, router] } })
  return { ...utils, pinia, router }
}

/** Data contoh lelang untuk pengujian. */
export const makeAucation = (overrides = {}) => ({
  id: 1,
  user_id: 1,
  title: 'Keyboard Gaming RGB',
  cover: 'http://img.test/cover.jpg',
  description: 'Barang masih mulus',
  start_bid: 200000,
  closed_at: '2099-12-31 23:59:59',
  created_at: '2024-10-05T09:04:49.000000Z',
  author: { name: 'Abdullah Ubaid', photo: '' },
  bids: [],
  ...overrides,
})

export const deferred = () => {
  let resolve
  const promise = new Promise((r) => {
    resolve = r
  })
  return { promise, resolve }
}
