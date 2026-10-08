import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import AucationLayout from './AucationLayout.vue'

describe('AucationLayout', () => {
  const NavbarStub = {
    name: 'NavbarComponent',
    template: `
      <header data-testid="navbar">
        <button
          data-testid="toggle-sidebar"
          @click="$emit('toggle-sidebar')"
        >
          Toggle
        </button>
      </header>
    `,
  }

  const SidebarStub = {
    name: 'SidebarComponent',
    props: {
      open: {
        type: Boolean,
        default: false,
      },
    },
    template: `
      <aside data-testid="sidebar">
        <span data-testid="sidebar-state">
          {{ open ? 'open' : 'closed' }}
        </span>
        <button
          data-testid="close-sidebar"
          @click="$emit('close')"
        >
          Close
        </button>
      </aside>
    `,
  }

  const RouterViewStub = {
    name: 'RouterView',
    template: `
      <div data-testid="router-view">
        Router View
      </div>
    `,
  }

  function mountLayout() {
    return mount(
      AucationLayout,
      {
        global: {
          stubs: {
            NavbarComponent: NavbarStub,
            SidebarComponent: SidebarStub,
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

  it('menggunakan background slate 50', () => {
    const wrapper =
      mountLayout()

    const container =
      wrapper.find(
        'div.min-h-screen',
      )

    expect(
      container.classes(),
    ).toContain(
      'bg-slate-50',
    )
  })

  it('menampilkan NavbarComponent', () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.find(
        '[data-testid="navbar"]',
      ).exists(),
    ).toBe(true)
  })

  it('menampilkan SidebarComponent', () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.find(
        '[data-testid="sidebar"]',
      ).exists(),
    ).toBe(true)
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

  it('sidebar dalam keadaan tertutup ketika layout pertama kali dibuka', () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.find(
        '[data-testid="sidebar-state"]',
      ).text(),
    ).toBe('closed')
  })

  it('membuka sidebar ketika NavbarComponent mengirim toggle-sidebar', async () => {
    const wrapper =
      mountLayout()

    expect(
      wrapper.find(
        '[data-testid="sidebar-state"]',
      ).text(),
    ).toBe('closed')

    await wrapper
      .find(
        '[data-testid="toggle-sidebar"]',
      )
      .trigger('click')

    expect(
      wrapper.find(
        '[data-testid="sidebar-state"]',
      ).text(),
    ).toBe('open')
  })

  it('menutup sidebar ketika NavbarComponent di-toggle dua kali', async () => {
    const wrapper =
      mountLayout()

    const toggleButton =
      wrapper.find(
        '[data-testid="toggle-sidebar"]',
      )

    await toggleButton.trigger(
      'click',
    )

    expect(
      wrapper.find(
        '[data-testid="sidebar-state"]',
      ).text(),
    ).toBe('open')

    await toggleButton.trigger(
      'click',
    )

    expect(
      wrapper.find(
        '[data-testid="sidebar-state"]',
      ).text(),
    ).toBe('closed')
  })

  it('menutup sidebar ketika SidebarComponent mengirim close', async () => {
    const wrapper =
      mountLayout()

    await wrapper
      .find(
        '[data-testid="toggle-sidebar"]',
      )
      .trigger('click')

    expect(
      wrapper.find(
        '[data-testid="sidebar-state"]',
      ).text(),
    ).toBe('open')

    await wrapper
      .find(
        '[data-testid="close-sidebar"]',
      )
      .trigger('click')

    expect(
      wrapper.find(
        '[data-testid="sidebar-state"]',
      ).text(),
    ).toBe('closed')
  })

  it('memberikan nilai open yang benar kepada SidebarComponent', async () => {
    const wrapper =
      mountLayout()

    const sidebar =
      wrapper.find(
        '[data-testid="sidebar-state"]',
      )

    expect(
      sidebar.text(),
    ).toBe('closed')

    await wrapper
      .find(
        '[data-testid="toggle-sidebar"]',
      )
      .trigger('click')

    expect(
      sidebar.text(),
    ).toBe('open')
  })

  it('memiliki main dengan class layout yang benar', () => {
    const wrapper =
      mountLayout()

    const main =
      wrapper.find('main')

    expect(
      main.exists(),
    ).toBe(true)

    expect(
      main.classes(),
    ).toContain(
      'min-w-0',
    )

    expect(
      main.classes(),
    ).toContain(
      'flex-1',
    )

    expect(
      main.classes(),
    ).toContain(
      'p-4',
    )

    expect(
      main.classes(),
    ).toContain(
      'md:p-8',
    )
  })

  it('memiliki container flex untuk navbar content', () => {
    const wrapper =
      mountLayout()

    const main =
      wrapper.find('main')

    expect(
      main.exists(),
    ).toBe(true)

    const parent =
      main.element.parentElement

    expect(
      parent,
    ).not.toBeNull()

    expect(
      parent.classList.contains(
        'flex',
      ),
    ).toBe(true)
  })
})