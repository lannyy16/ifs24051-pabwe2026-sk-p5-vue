import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  createPinia,
  setActivePinia,
} from 'pinia'

import {
  mount,
} from '@vue/test-utils'

import RegisterPage from './RegisterPage.vue'
import { useAuthStore } from '../states/authStore'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),

  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    template: `
      <a
        :href="to"
        data-testid="router-link"
      >
        <slot />
      </a>
    `,
  },
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function mountPage() {
    const pinia = createPinia()

    setActivePinia(pinia)

    const wrapper = mount(
      RegisterPage,
      {
        global: {
          plugins: [
            pinia,
          ],

          stubs: {
            RouterLink: {
              name: 'RouterLink',
              props: ['to'],
              template: `
                <a
                  :href="to"
                  data-testid="router-link"
                >
                  <slot />
                </a>
              `,
            },
          },
        },
      },
    )

    const authStore =
      useAuthStore()

    return {
      wrapper,
      authStore,
    }
  }

  it('menampilkan halaman register', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.exists(),
    ).toBe(true)
  })

  it('menampilkan judul Delcom Auction', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.text(),
    ).toContain(
      'Delcom Auction',
    )
  })

  it('menampilkan input name', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        '#name',
      ).exists(),
    ).toBe(true)
  })

  it('menampilkan input email', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        '#email',
      ).exists(),
    ).toBe(true)
  })

  it('menampilkan input password', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        '#password',
      ).exists(),
    ).toBe(true)
  })

  it('dapat mengisi nama', async () => {
    const {
      wrapper,
    } = mountPage()

    const input =
      wrapper.find(
        '#name',
      )

    await input.setValue(
      'Karina Putri Sion',
    )

    expect(
      input.element.value,
    ).toBe(
      'Karina Putri Sion',
    )
  })

  it('dapat mengisi email', async () => {
    const {
      wrapper,
    } = mountPage()

    const input =
      wrapper.find(
        '#email',
      )

    await input.setValue(
      'karina@example.com',
    )

    expect(
      input.element.value,
    ).toBe(
      'karina@example.com',
    )
  })

  it('dapat mengisi password', async () => {
    const {
      wrapper,
    } = mountPage()

    const input =
      wrapper.find(
        '#password',
      )

    await input.setValue(
      'password123',
    )

    expect(
      input.element.value,
    ).toBe(
      'password123',
    )
  })

  it('password awalnya tersembunyi', () => {
    const {
      wrapper,
    } = mountPage()

    const password =
      wrapper.find(
        '#password',
      )

    expect(
      password.attributes(
        'type',
      ),
    ).toBe(
      'password',
    )
  })

  it('dapat menampilkan password', async () => {
    const {
      wrapper,
    } = mountPage()

    const password =
      wrapper.find(
        '#password',
      )

    const toggleButton =
      wrapper
        .findAll('button')
        .find(
          (button) =>
            button.attributes(
              'type',
            ) === 'button',
        )

    await toggleButton.trigger(
      'click',
    )

    expect(
      password.attributes(
        'type',
      ),
    ).toBe(
      'text',
    )
  })

  it('dapat menyembunyikan password kembali', async () => {
    const {
      wrapper,
    } = mountPage()

    const password =
      wrapper.find(
        '#password',
      )

    const toggleButton =
      wrapper
        .findAll('button')
        .find(
          (button) =>
            button.attributes(
              'type',
            ) === 'button',
        )

    await toggleButton.trigger(
      'click',
    )

    expect(
      password.attributes(
        'type',
      ),
    ).toBe(
      'text',
    )

    await toggleButton.trigger(
      'click',
    )

    expect(
      password.attributes(
        'type',
      ),
    ).toBe(
      'password',
    )
  })

  it('menampilkan tombol daftar', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        'button[type="submit"]',
      ).exists(),
    ).toBe(true)
  })

  it('menampilkan teks Daftar pada tombol', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        'button[type="submit"]',
      ).text(),
    ).toContain(
      'Daftar',
    )
  })

  it('memiliki form register', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        'form',
      ).exists(),
    ).toBe(true)
  })

  it('menampilkan link menuju login', () => {
    const {
      wrapper,
    } = mountPage()

    const loginLink =
      wrapper.find(
        '[data-testid="router-link"]',
      )

    expect(
      loginLink.exists(),
    ).toBe(true)
  })

  it('link masuk menuju halaman login', () => {
    const {
      wrapper,
    } = mountPage()

    const loginLink =
      wrapper
        .findAll(
          '[data-testid="router-link"]',
        )
        .find(
          (link) =>
            link.attributes(
              'href',
            ) === '/auth/login',
        )

    expect(
      loginLink,
    ).toBeDefined()
  })

  it('register dipanggil dengan data yang benar', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.register =
      vi.fn()
        .mockResolvedValue(
          {},
        )

    await wrapper
      .find('#name')
      .setValue(
        'Karina Putri Sion',
      )

    await wrapper
      .find('#email')
      .setValue(
        'karina@example.com',
      )

    await wrapper
      .find('#password')
      .setValue(
        'password123',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      authStore.register,
    ).toHaveBeenCalledWith({
      name: 'Karina Putri Sion',
      email: 'karina@example.com',
      password: 'password123',
    })
  })

  it('redirect ke login setelah register berhasil', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.register =
      vi.fn()
        .mockResolvedValue(
          {},
        )

    await wrapper
      .find('#name')
      .setValue(
        'Karina Putri Sion',
      )

    await wrapper
      .find('#email')
      .setValue(
        'karina@example.com',
      )

    await wrapper
      .find('#password')
      .setValue(
        'password123',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      pushMock,
    ).toHaveBeenCalledWith(
      '/auth/login',
    )
  })

  it('tidak register jika nama kosong', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.register =
      vi.fn()

    await wrapper
      .find('#email')
      .setValue(
        'karina@example.com',
      )

    await wrapper
      .find('#password')
      .setValue(
        'password123',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      authStore.register,
    ).not.toHaveBeenCalled()
  })

  it('tidak register jika email kosong', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.register =
      vi.fn()

    await wrapper
      .find('#name')
      .setValue(
        'Karina Putri Sion',
      )

    await wrapper
      .find('#password')
      .setValue(
        'password123',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      authStore.register,
    ).not.toHaveBeenCalled()
  })

  it('tidak register jika password kosong', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.register =
      vi.fn()

    await wrapper
      .find('#name')
      .setValue(
        'Karina Putri Sion',
      )

    await wrapper
      .find('#email')
      .setValue(
        'karina@example.com',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      authStore.register,
    ).not.toHaveBeenCalled()
  })

  it('menghapus spasi pada nama dan email sebelum register', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.register =
      vi.fn()
        .mockResolvedValue(
          {},
        )

    await wrapper
      .find('#name')
      .setValue(
        '  Karina Putri Sion  ',
      )

    await wrapper
      .find('#email')
      .setValue(
        '  karina@example.com  ',
      )

    await wrapper
      .find('#password')
      .setValue(
        'password123',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      authStore.register,
    ).toHaveBeenCalledWith({
      name: 'Karina Putri Sion',
      email: 'karina@example.com',
      password: 'password123',
    })
  })

  it('menampilkan error dari auth store', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.error =
      'Gagal mendaftar'

    await wrapper.vm.$nextTick()

    expect(
      wrapper.text(),
    ).toContain(
      'Gagal mendaftar',
    )
  })

  it('tombol disabled ketika loading', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.loading = true

    await wrapper.vm.$nextTick()

    const button =
      wrapper.find(
        'button[type="submit"]',
      )

    expect(
      button.attributes(
        'disabled',
      ),
    ).toBeDefined()
  })

  it('menampilkan teks Mendaftarkan ketika loading', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.loading = true

    await wrapper.vm.$nextTick()

    expect(
      wrapper.text(),
    ).toContain(
      'Mendaftarkan...',
    )
  })

  it('menangani error ketika register gagal', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    const error =
      new Error(
        'Register gagal',
      )

    authStore.register =
      vi.fn()
        .mockRejectedValue(
          error,
        )

    const consoleError =
      vi
        .spyOn(
          console,
          'error',
        )
        .mockImplementation(
          () => {},
        )

    await wrapper
      .find('#name')
      .setValue(
        'Karina Putri Sion',
      )

    await wrapper
      .find('#email')
      .setValue(
        'karina@example.com',
      )

    await wrapper
      .find('#password')
      .setValue(
        'password123',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      consoleError,
    ).toHaveBeenCalledWith(
      error,
    )

    expect(
      pushMock,
    ).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })
})