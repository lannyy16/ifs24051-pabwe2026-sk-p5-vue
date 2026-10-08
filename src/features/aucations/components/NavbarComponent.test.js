import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/vue'
import Swal from 'sweetalert2'
import NavbarComponent from './NavbarComponent.vue'
import * as authApi from '../../auth/api/authApi'
import { getAccessToken, putAccessToken } from '../../../helpers/apiHelper'
import { renderWithProviders } from '../../../test-utils'

vi.mock('../../auth/api/authApi')

const withProfile = { users: { profile: { id: 1, name: 'Abdullah Ubaid', photo: 'img/profile/1.png' } } }

describe('NavbarComponent', () => {
  beforeEach(() => authApi.logout.mockResolvedValue({ status: 'success' }))

  it('menampilkan nama dan foto profil', async () => {
    await renderWithProviders(NavbarComponent, { initialState: withProfile })
    expect(screen.getByText('Abdullah Ubaid')).toBeInTheDocument()
    expect(screen.getByAltText('Foto profil')).toHaveAttribute('src', 'https://open-api.delcom.org/img/profile/1.png')
  })

  it('tanpa foto: inisial; tanpa profil: nama Pengguna', async () => {
    const { unmount } = await renderWithProviders(NavbarComponent, {
      initialState: { users: { profile: { id: 1, name: 'Abdullah Ubaid', photo: '' } } },
    })
    expect(screen.getByText('AU')).toBeInTheDocument()
    unmount()
    await renderWithProviders(NavbarComponent)
    expect(screen.getByText('Pengguna')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('tombol menu mengirim event toggle-sidebar', async () => {
    const { emitted } = await renderWithProviders(NavbarComponent)
    await fireEvent.click(screen.getByLabelText('Buka menu'))
    expect(emitted()['toggle-sidebar']).toHaveLength(1)
  })

  it('menu cepat dapat dibuka, ditutup, dan tertutup setelah memilih tautan', async () => {
    await renderWithProviders(NavbarComponent, { initialState: withProfile })
    const toggle = screen.getByLabelText('Menu akun')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await fireEvent.click(toggle)
    expect(screen.getByRole('menuitem', { name: /profil saya/i })).toHaveAttribute('href', '/profile')
    expect(screen.getByRole('menuitem', { name: /pasang lelang/i })).toHaveAttribute('href', '/?add=1')
    await fireEvent.click(toggle)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await fireEvent.click(toggle)
    await fireEvent.click(screen.getByRole('menuitem', { name: /profil saya/i }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await fireEvent.click(toggle)
    await fireEvent.click(screen.getByRole('menuitem', { name: /pasang lelang/i }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('logout terkonfirmasi menghapus sesi dan menuju halaman login', async () => {
    putAccessToken('TOK')
    const { router } = await renderWithProviders(NavbarComponent, { initialState: withProfile })
    await fireEvent.click(screen.getByRole('button', { name: /keluar/i }))
    await waitFor(() => expect(router.currentRoute.value.path).toBe('/auth/login'))
    expect(authApi.logout).toHaveBeenCalled()
    expect(getAccessToken()).toBeNull()
  })

  it('logout dibatalkan tidak melakukan apa pun', async () => {
    putAccessToken('TOK')
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false })
    const { router } = await renderWithProviders(NavbarComponent, { initialState: withProfile })
    await fireEvent.click(screen.getByRole('button', { name: /keluar/i }))
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled())
    expect(authApi.logout).not.toHaveBeenCalled()
    expect(getAccessToken()).toBe('TOK')
    expect(router.currentRoute.value.path).toBe('/')
  })
})
