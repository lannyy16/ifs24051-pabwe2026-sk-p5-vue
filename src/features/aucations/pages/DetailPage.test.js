import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/vue'
import Swal from 'sweetalert2'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import DetailPage from './DetailPage.vue'
import * as api from '../api/aucationApi'
import { Blank, deferred, makeAucation, renderWithProviders } from '../../../test-utils'

vi.mock('../api/aucationApi')

const routes = [
  { path: '/aucations/:aucationId', component: Blank },
  { path: '/:pathMatch(.*)*', component: Blank },
]
const bids = [
  { id: 10, bid: 250000, created_at: '2024-10-05T08:44:12.000000Z' },
  { id: 11, bid: 400000, created_at: '2024-10-06T08:44:12.000000Z' },
]
const base = makeAucation({ id: 5, user_id: 1, description: '# Deskripsi', bids, my_bid: null })
const respond = (aucation) => api.getAucation.mockResolvedValue({ status: 'success', data: { aucation } })
const render = (profileId = 1, id = 5) =>
  renderWithProviders(DetailPage, { route: `/aucations/${id}`, routes, initialState: { users: { profile: { id: profileId } } } })
const button = (name) => screen.getByRole('button', { name })

describe('DetailPage', () => {
  beforeEach(() => {
    respond(base)
    api.deleteAucation.mockResolvedValue({ status: 'success', message: 'Berhasil menghapus data' })
    api.deleteBid.mockResolvedValue({ status: 'success', message: 'Berhasil menghapus tawaran' })
    api.addBid.mockResolvedValue({ status: 'success', message: 'Berhasil memberikan tawaran' })
  })

  it('memuat detail berdasarkan parameter rute', async () => {
    const pending = deferred()
    api.getAucation.mockReturnValue(pending.promise)
    await render()
    expect(screen.getByText('Memuat detail lelang…')).toBeInTheDocument()
    pending.resolve({ status: 'success', data: { aucation: base } })
    expect(await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })).toBeInTheDocument()
    expect(api.getAucation).toHaveBeenCalledWith('5')
    expect(screen.getByAltText('Keyboard Gaming RGB')).toHaveAttribute('src', 'http://img.test/cover.jpg')
    expect(Viewer.instances[0].options.initialValue).toBe('# Deskripsi')
    expect(screen.getByText(/oleh Abdullah Ubaid/)).toBeInTheDocument()
    expect(screen.getByText(/^Sisa/)).toBeInTheDocument()
  })

  it('menampilkan pesan jika lelang tidak ditemukan', async () => {
    api.getAucation.mockResolvedValue({ status: 'fail', message: 'Data tidak ditemukan' })
    await render()
    expect(await screen.findByText('Lelang tidak ditemukan')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /kembali ke dashboard/i })).toHaveAttribute('href', '/')
  })

  it('riwayat tawaran diurutkan dari yang tertinggi dan menampilkan tawaran tertinggi', async () => {
    await render()
    await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('400.000')
    expect(items[1]).toHaveTextContent('250.000')
    expect(screen.getAllByText(/400\.000/).length).toBeGreaterThan(1)
  })

  it('riwayat kosong dan cover kosong memakai placeholder', async () => {
    respond({ ...base, bids: [], cover: '' })
    await render()
    expect(await screen.findByText(/Belum ada tawaran/)).toBeInTheDocument()
    expect(screen.queryByAltText('Keyboard Gaming RGB')).not.toBeInTheDocument()
  })

  it('pemilik melihat aksi ubah/ganti cover/hapus, bukan tombol tawar', async () => {
    await render(1)
    await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })
    expect(button('Ubah')).toBeInTheDocument()
    expect(button('Ganti cover')).toBeInTheDocument()
    expect(button('Hapus')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ajukan tawaran' })).not.toBeInTheDocument()
  })

  it('pemilik membuka dan menutup modal ubah & ganti cover', async () => {
    await render(1)
    await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })
    await fireEvent.click(button('Ubah'))
    const change = screen.getByRole('dialog', { name: 'Ubah lelang' })
    await fireEvent.click(within(change).getByLabelText('Tutup'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await fireEvent.click(button('Ganti cover'))
    const cover = screen.getByRole('dialog', { name: 'Ganti cover' })
    await fireEvent.click(within(cover).getByLabelText('Tutup'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('menyimpan perubahan memuat ulang detail', async () => {
    api.changeAucation.mockResolvedValue({ status: 'success', message: 'Berhasil mengubah data' })
    await render(1)
    await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })
    await fireEvent.click(button('Ubah'))
    await fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }))
    await waitFor(() => expect(api.changeAucation).toHaveBeenCalled())
    await waitFor(() => expect(api.getAucation).toHaveBeenCalledTimes(2))
  })

  it('hapus lelang: berhasil kembali ke dashboard, gagal menampilkan error, batal tidak menghapus', async () => {
    const { router } = await render(1)
    await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })

    api.deleteAucation.mockResolvedValueOnce({ status: 'fail', message: 'Tidak boleh' })
    await fireEvent.click(button('Hapus'))
    await waitFor(() => expect(Swal.fire.mock.calls.at(-1)[0]).toMatchObject({ icon: 'error', text: 'Tidak boleh' }))
    expect(router.currentRoute.value.path).toBe('/aucations/5')

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false })
    await fireEvent.click(button('Hapus'))
    await waitFor(() => expect(Swal.fire.mock.calls.at(-1)[0].icon).toBe('warning'))
    expect(api.deleteAucation).toHaveBeenCalledTimes(1)

    await fireEvent.click(button('Hapus'))
    await waitFor(() => expect(router.currentRoute.value.path).toBe('/'))
    expect(api.deleteAucation).toHaveBeenLastCalledWith(5)
  })

  it('pemilik pada lelang yang sudah ditutup melihat status ditutup', async () => {
    respond({ ...base, closed_at: '2000-01-01 00:00:00' })
    await render(1)
    expect(await screen.findByText('Lelang ditutup')).toBeInTheDocument()
  })

  it('peserta tanpa tawaran: bisa mengajukan tawaran dan daftar dimuat ulang setelahnya', async () => {
    await render(2)
    await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })
    expect(screen.queryByRole('button', { name: 'Ubah' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Tawaranmu/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Batalkan tawaran' })).not.toBeInTheDocument()

    await fireEvent.click(button('Ajukan tawaran'))
    const dialog = screen.getByRole('dialog', { name: 'Ajukan tawaran' })
    await fireEvent.click(within(dialog).getByLabelText('Tutup'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await fireEvent.click(button('Ajukan tawaran'))
    await fireEvent.update(screen.getByLabelText('Nominal tawaranmu (Rp)'), '500000')
    await fireEvent.click(screen.getByRole('button', { name: 'Kirim tawaran' }))
    await waitFor(() => expect(api.addBid).toHaveBeenCalledWith(5, 500000))
    await waitFor(() => expect(api.getAucation).toHaveBeenCalledTimes(2))
  })

  it('peserta dengan tawaran melihat tawarannya dan dapat membatalkannya', async () => {
    respond({ ...base, my_bid: bids[0] })
    await render(2)
    await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })
    expect(screen.getByText(/Tawaranmu:/)).toBeInTheDocument()
    expect(screen.getAllByText('tawaranmu')).toHaveLength(1)

    await fireEvent.click(button('Batalkan tawaran'))
    await waitFor(() => expect(api.deleteBid).toHaveBeenCalledWith(5))
    await waitFor(() => expect(api.getAucation).toHaveBeenCalledTimes(2))
  })

  it('peserta tidak melihat aksi pada lelang yang sudah ditutup', async () => {
    respond({ ...base, closed_at: '2000-01-01 00:00:00' })
    await render(2)
    await screen.findByText('Lelang ditutup')
    expect(screen.queryByRole('button', { name: 'Ajukan tawaran' })).not.toBeInTheDocument()
  })

  it('memuat ulang ketika parameter id berubah', async () => {
    const { router } = await render()
    await screen.findByRole('heading', { name: 'Keyboard Gaming RGB' })
    const pending = deferred()
    api.getAucation.mockReturnValue(pending.promise)
    await router.push('/aucations/6')
    await waitFor(() => expect(api.getAucation).toHaveBeenLastCalledWith('6'))
    pending.resolve({ status: 'fail' })
  })
})
