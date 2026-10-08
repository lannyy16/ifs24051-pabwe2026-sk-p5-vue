import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import AuthLayout from './AuthLayout.vue'

describe('AuthLayout', () => {
  const RouterViewStub = {
    name: 'RouterView',
    template: '<div data-testid="router-view"></div>',
  }

  function mountLayout() {
    return mount(
      AuthLayout,
      {
        global: {
          stubs: {
            RouterView: RouterViewStub,
          },
        },
      },
    )
  }

  it('menampilkan layout utama', () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.find(
        'div.min-h-screen',
      ).exists(),
    ).toBe(true)
  })

  it('menggunakan background slate 950', () => {
    const wrapper =
      mountLayout()

    const container =
      wrapper.find(
        'div.min-h-screen',
      )

    expect(
      container.classes(),
    ).toContain(
      'bg-slate-950',
    )
  })

  it('menampilkan logo DA', () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.text(),
    ).toContain('DA')
  })

  it('menampilkan nama aplikasi Delcom Auction', () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.text(),
    ).toContain(
      'Delcom Auction',
    )
  })

  it('menampilkan deskripsi aplikasi', () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.text(),
    ).toContain(
      'Aplikasi lelang sederhana',
    )
  })

  it('menampilkan RouterView', () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.find(
        '[data-testid="router-view"]',
      ).exists(),
    ).toBe(true)
  })

  it('menempatkan konten pada area tengah halaman', () => {
    const wrapper =
      mountLayout()

    const container =
      wrapper.find(
        'div.min-h-screen',
      )

    expect(
      container.classes(),
    ).toContain(
      'flex',
    )

    expect(
      container.classes(),
    ).toContain(
      'items-center',
    )

    expect(
      container.classes(),
    ).toContain(
      'justify-center',
    )
  })

  it('memiliki padding halaman', () => {
    const wrapper =
      mountLayout()

    const container =
      wrapper.find(
        'div.min-h-screen',
      )

    expect(
      container.classes(),
    ).toContain(
      'p-6',
    )
  })

  it('memiliki container dengan lebar maksimum medium', () => {
    const wrapper =
      mountLayout()

    const content =
      wrapper.find(
        'div.w-full.max-w-md',
      )

    expect(
      content.exists(),
    ).toBe(true)
  })

  it('menampilkan heading dengan styling yang sesuai', () => {
    const wrapper =
      mountLayout()

    const heading =
      wrapper.find('h1')

    expect(
      heading.exists(),
    ).toBe(true)

    expect(
      heading.text(),
    ).toBe(
      'Delcom Auction',
    )

    expect(
      heading.classes(),
    ).toContain(
      'text-white',
    )

    expect(
      heading.classes(),
    ).toContain(
      'font-bold',
    )
  })
})