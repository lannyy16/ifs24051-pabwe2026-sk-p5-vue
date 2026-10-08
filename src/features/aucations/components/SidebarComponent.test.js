import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/vue'
import SidebarComponent from './SidebarComponent.vue'
import { renderWithProviders } from '../../../test-utils'

const link = (name) => screen.getByRole('link', { name })

describe('SidebarComponent', () => {
  it('menampilkan empat menu navigasi', async () => {
    await renderWithProviders(SidebarComponent)
    expect(link('Dashboard Lelang')).toHaveAttribute('href', '/')
    expect(link('Lelang Saya')).toHaveAttribute('href', '/?tab=mine')
    expect(link('Daftar Pengguna')).toHaveAttribute('href', '/users')
    expect(link('Profil Saya')).toHaveAttribute('href', '/profile')
  })

  it.each([
    ['/', 'Dashboard Lelang'],
    ['/?tab=mine', 'Lelang Saya'],
    ['/users', 'Daftar Pengguna'],
    ['/profile', 'Profil Saya'],
  ])('menandai menu aktif untuk %s', async (route, active) => {
    await renderWithProviders(SidebarComponent, { route })
    expect(link(active)).toHaveClass('bg-white')
    const others = screen.getAllByRole('link').filter((el) => el !== link(active))
    others.forEach((el) => expect(el).not.toHaveClass('bg-white'))
  })

  it('drawer tertutup secara default dan tanpa backdrop', async () => {
    await renderWithProviders(SidebarComponent)
    expect(screen.getByLabelText('Navigasi utama')).toHaveClass('-translate-x-full')
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument()
  })

  it('drawer terbuka: backdrop, tombol tutup, dan klik menu memicu close', async () => {
    const { emitted } = await renderWithProviders(SidebarComponent, { props: { open: true } })
    expect(screen.getByLabelText('Navigasi utama')).toHaveClass('translate-x-0')
    await fireEvent.click(screen.getByTestId('sidebar-backdrop'))
    await fireEvent.click(screen.getByLabelText('Tutup menu'))
    await fireEvent.click(link('Profil Saya'))
    expect(emitted().close).toHaveLength(3)
  })
})
