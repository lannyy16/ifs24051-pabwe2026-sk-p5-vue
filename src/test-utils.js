import { render } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

export function createMockPinia() {
  const pinia = createPinia()

  setActivePinia(pinia)

  return pinia
}

export function createMockRouter(routes = []) {
  return createRouter({
    history: createMemoryHistory(),
    routes,
  })
}

export function renderWithProviders(
  component,
  options = {},
) {
  const pinia =
    options.pinia || createMockPinia()

  const router =
    options.router || createMockRouter()

  return render(component, {
    ...options,
    global: {
      ...(options.global || {}),
      plugins: [
        pinia,
        router,
        ...((options.global || {}).plugins || []),
      ],
    },
  })
}