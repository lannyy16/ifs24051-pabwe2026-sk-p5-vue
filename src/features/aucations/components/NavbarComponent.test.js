import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import NavbarComponent from './NavbarComponent.vue'

const pushMock = vi.fn()

const logoutMock = vi.fn()

vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    template:
      '<a :href="to"><slot /></a>',
  },

  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('../../auth/states/authStore', () => ({
  useAuthStore: () => ({
    logout: logoutMock,
  }),
}))

describe('NavbarComponent', () => {
  beforeEach(() => {
    pushMock.mockReset()
    logoutMock.mockReset()

    logoutMock.mockResolvedValue(undefined)
    pushMock.mockResolvedValue(undefined)
  })

  it('menampilkan nama aplikasi', () => {
    const wrapper = mount(
      NavbarComponent,
    )

    expect(
      wrapper.text(),
    ).toContain('Delcom Auction')
  })

  it('menampilkan tombol Keluar', () => {
    const wrapper = mount(
      NavbarComponent,
    )

    const buttons =
      wrapper.findAll('button')

    expect(
      buttons.some(
        (button) =>
          button.text() === 'Keluar',
      ),
    ).toBe(true)
  })

  it('memiliki RouterLink menuju halaman utama', () => {
    const wrapper = mount(
      NavbarComponent,
    )

    const link =
      wrapper.findComponent(
        {
          name: 'RouterLink',
        },
      )

    expect(
      link.exists(),
    ).toBe(true)

    expect(
      link.props('to'),
    ).toBe('/')
  })

  it('menampilkan tombol toggle sidebar', () => {
    const wrapper = mount(
      NavbarComponent,
    )

    const buttons =
      wrapper.findAll('button')

    expect(
      buttons.length,
    ).toBe(2)

    expect(
      buttons[0].text(),
    ).toContain('☰')
  })

  it('mengirim event toggle-sidebar ketika tombol menu diklik', async () => {
    const wrapper = mount(
      NavbarComponent,
    )

    const buttons =
      wrapper.findAll('button')

    await buttons[0].trigger('click')

    expect(
      wrapper.emitted(
        'toggle-sidebar',
      ),
    ).toBeTruthy()

    expect(
      wrapper.emitted(
        'toggle-sidebar',
      ).length,
    ).toBe(1)
  })

  it('memanggil logout dan mengarahkan ke halaman login', async () => {
    const wrapper = mount(
      NavbarComponent,
    )

    const logoutButton =
      wrapper
        .findAll('button')
        .find(
          (button) =>
            button.text() === 'Keluar',
        )

    await logoutButton.trigger('click')

    expect(
      logoutMock,
    ).toHaveBeenCalledTimes(1)

    expect(
      pushMock,
    ).toHaveBeenCalledTimes(1)

    expect(
      pushMock,
    ).toHaveBeenCalledWith(
      '/auth/login',
    )
  })

  it('menunggu proses logout sebelum navigasi', async () => {
    let resolveLogout

    logoutMock.mockImplementation(
      () =>
        new Promise(
          (resolve) => {
            resolveLogout = resolve
          },
        ),
    )

    const wrapper = mount(
      NavbarComponent,
    )

    const logoutButton =
      wrapper
        .findAll('button')
        .find(
          (button) =>
            button.text() === 'Keluar',
        )

    const clickPromise =
      logoutButton.trigger('click')

    await Promise.resolve()

    expect(
      logoutMock,
    ).toHaveBeenCalledTimes(1)

    expect(
      pushMock,
    ).not.toHaveBeenCalled()

    resolveLogout()

    await clickPromise

    expect(
      pushMock,
    ).toHaveBeenCalledWith(
      '/auth/login',
    )
  })
})