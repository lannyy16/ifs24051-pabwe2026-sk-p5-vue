import { render } from '@testing-library/vue'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'

export function renderWithProviders(component, options = {}) {
  const pinia = createPinia()

  const router =
    options.router ||
    createRouter({
      history: createMemoryHistory(),
      routes: options.routes || [],
    })

  return render(component, {
    global: {
      plugins: [pinia, router],
      ...options.global,
    },
    ...options,
  })
}
