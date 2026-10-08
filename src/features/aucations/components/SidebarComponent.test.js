import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import SidebarComponent from './SidebarComponent.vue'

describe('SidebarComponent', () => {
  const RouterLinkStub = {
    name: 'RouterLink',
    props: ['to'],
    template:
      '<a :href="to"><slot /></a>',
  }

  function mountSidebar(
    props = {},
  ) {
    return mount(
      SidebarComponent,
      {
        props,
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          },
        },
      },
    )
  }

  it('sidebar tertutup secara default', () => {
    const wrapper =
      mountSidebar()

    expect(
      wrapper.classes(),
    ).toContain(
      '-translate-x-full',
    )

    expect(
      wrapper.classes(),
    ).not.toContain(
      'translate-x-0',
    )
  })

  it('sidebar terbuka ketika open bernilai true', () => {
    const wrapper =
      mountSidebar({
        open: true,
      })

    expect(
      wrapper.classes(),
    ).toContain(
      'translate-x-0',
    )

    expect(
      wrapper.classes(),
    ).not.toContain(
      '-translate-x-full',
    )
  })

  it('menampilkan tiga link navigasi', () => {
    const wrapper =
      mountSidebar()

    const links =
      wrapper.findAll('a')

    expect(
      links.length,
    ).toBe(3)
  })

  it('memiliki link Dashboard menuju halaman utama', () => {
    const wrapper =
      mountSidebar()

    const link =
      wrapper.findAll('a')[0]

    expect(
      link.attributes('href'),
    ).toBe('/')

    expect(
      link.text(),
    ).toContain('Dashboard')
  })

  it('memiliki link Pengguna menuju halaman users', () => {
    const wrapper =
      mountSidebar()

    const link =
      wrapper.findAll('a')[1]

    expect(
      link.attributes('href'),
    ).toBe('/users')

    expect(
      link.text(),
    ).toContain('Pengguna')
  })

  it('memiliki link Profil menuju halaman profile', () => {
    const wrapper =
      mountSidebar()

    const link =
      wrapper.findAll('a')[2]

    expect(
      link.attributes('href'),
    ).toBe('/profile')

    expect(
      link.text(),
    ).toContain('Profil')
  })

  it('mengirim event close ketika Dashboard diklik', async () => {
    const wrapper =
      mountSidebar()

    const link =
      wrapper.findAll('a')[0]

    await link.trigger('click')

    expect(
      wrapper.emitted('close'),
    ).toHaveLength(1)
  })

  it('mengirim event close ketika Pengguna diklik', async () => {
    const wrapper =
      mountSidebar()

    const link =
      wrapper.findAll('a')[1]

    await link.trigger('click')

    expect(
      wrapper.emitted('close'),
    ).toHaveLength(1)
  })

  it('mengirim event close ketika Profil diklik', async () => {
    const wrapper =
      mountSidebar()

    const link =
      wrapper.findAll('a')[2]

    await link.trigger('click')

    expect(
      wrapper.emitted('close'),
    ).toHaveLength(1)
  })

  it('memiliki elemen aside sebagai container sidebar', () => {
    const wrapper =
      mountSidebar()

    expect(
      wrapper.element.tagName,
    ).toBe('ASIDE')
  })
})