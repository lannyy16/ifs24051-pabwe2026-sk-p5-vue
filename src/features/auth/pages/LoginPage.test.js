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

import LoginPage from './LoginPage.vue'
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

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    setActivePinia(
      createPinia(),
    )
  })

  function mountPage() {
    const pinia =
      createPinia()

    setActivePinia(pinia)

    const wrapper =
      mount(
        LoginPage,
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

  it('menampilkan halaman login', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.exists(),
    ).toBe(true)
  })

  it('menampilkan judul Masuk', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.text(),
    ).toContain(
      'Masuk',
    )
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

    expect(
      wrapper
        .find('#password')
        .attributes('type'),
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

    const button =
      wrapper
        .findAll('button')
        .find(
          (item) =>
            item.attributes(
              'type',
            ) === 'button',
        )

    await button.trigger(
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

    const button =
      wrapper
        .findAll('button')
        .find(
          (item) =>
            item.attributes(
              'type',
            ) === 'button',
        )

    await button.trigger(
      'click',
    )

    expect(
      password.attributes(
        'type',
      ),
    ).toBe(
      'text',
    )

    await button.trigger(
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

  it('menampilkan tombol masuk', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        'button[type="submit"]',
      ).exists(),
    ).toBe(true)
  })

  it('menampilkan teks Masuk pada tombol', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        'button[type="submit"]',
      ).text(),
    ).toContain(
      'Masuk',
    )
  })

  it('memiliki form login', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        'form',
      ).exists(),
    ).toBe(true)
  })

  it('menampilkan link menuju register', () => {
    const {
      wrapper,
    } = mountPage()

    expect(
      wrapper.find(
        '[data-testid="router-link"]',
      ).exists(),
    ).toBe(true)
  })

  it('link daftar menuju halaman register', () => {
    const {
      wrapper,
    } = mountPage()

    const link =
      wrapper
        .find(
          '[data-testid="router-link"]',
        )

    expect(
      link.attributes(
        'href',
      ),
    ).toBe(
      '/auth/register',
    )
  })

  it('login dipanggil dengan data yang benar', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.login =
      vi.fn()
        .mockResolvedValue(
          {},
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
      authStore.login,
    ).toHaveBeenCalledWith({
      email: 'karina@example.com',
      password: 'password123',
    })
  })

  it('redirect ke halaman utama setelah login berhasil', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.login =
      vi.fn()
        .mockResolvedValue(
          {},
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
      '/',
    )
  })

  it('tidak login jika email kosong', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.login =
      vi.fn()

    await wrapper
      .find('#password')
      .setValue(
        'password123',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      authStore.login,
    ).not.toHaveBeenCalled()

    expect(
      pushMock,
    ).not.toHaveBeenCalled()
  })

  it('tidak login jika password kosong', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.login =
      vi.fn()

    await wrapper
      .find('#email')
      .setValue(
        'karina@example.com',
      )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      authStore.login,
    ).not.toHaveBeenCalled()

    expect(
      pushMock,
    ).not.toHaveBeenCalled()
  })

  it('tidak login jika email hanya berisi spasi', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.login =
      vi.fn()

    await wrapper
      .find('#email')
      .setValue(
        '   ',
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
      authStore.login,
    ).not.toHaveBeenCalled()

    expect(
      pushMock,
    ).not.toHaveBeenCalled()
  })

  it('menghapus spasi pada email sebelum login', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.login =
      vi.fn()
        .mockResolvedValue(
          {},
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
      authStore.login,
    ).toHaveBeenCalledWith({
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
      'Email atau password salah'

    await wrapper.vm.$nextTick()

    expect(
      wrapper.text(),
    ).toContain(
      'Email atau password salah',
    )
  })

  it('tombol disabled ketika loading', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.loading =
      true

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

  it('menampilkan teks Sedang masuk ketika loading', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    authStore.loading =
      true

    await wrapper.vm.$nextTick()

    expect(
      wrapper.text(),
    ).toContain(
      'Sedang masuk...',
    )
  })

  it('menangani error ketika login gagal', async () => {
    const {
      wrapper,
      authStore,
    } = mountPage()

    const error =
      new Error(
        'Login gagal',
      )

    authStore.login =
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