import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/vue'
import Swal from 'sweetalert2'
import HomePage from './HomePage.vue'
import * as api from '../api/aucationApi'
import { deferred, makeAucation, renderWithProviders } from '../../../test-utils'

vi.mock('../api/aucationApi')

const owned = makeAucation({ id: 1, user_id: 1, title: 'Keyboard Gaming RGB', description: 'Barang mulus', bids: [{ id: 1, bid: 300000 }] })
const others = makeAucation({ id: 2, user_id: 2, title: 'Oculus Quest 2', cover: '', description: 'Second mulus', author: { name: 'Budi' }, bids: [] })
const closedOne = makeAucation({ id: 3, user_id: 2, title: 'Kamera Lama', closed_at: '2000-01-01 00:00:00', bids: [] })
const list = [owned, others, closedOne]
const state = { users: { profile: { id: 1 } } }

const render = (route = '/') => renderWithProviders(HomePage, { route, initialState: state })
const cards = () => screen.getAllByTestId('aucation-card')
const card = (title) => cards().find((el) => within(el).queryByText(title))

describe('HomePage', () => {
  beforeEach(() => {
    api.getAucations.mockResolvedValue({ status: 'success', data: { aucations: list } })
    api.deleteAucation.mockResolvedValue({ status: 'success', message: 'Berhasil menghapus data' })
    api.deleteAllAucations.mockResolvedValue({ status: 'success', message: 'Berhasil menghapus semua data pelelangan' })
    api.addBid.mockResolvedValue({ status: 'success', message: 'Berhasil memberikan tawaran' })
  })

  it('memuat semua lelang dan menampilkan kartu informatif', async () => {
    await render()
    await waitFor(() => expect(cards()).toHaveLength(3))
    expect(api.getAucations).toHaveBeenCalledWith({})
    const first = within(card('Keyboard Gaming RGB'))
    expect(first.getByText('1 tawaran')).toBeInTheDocument()
    expect(first.getByText(/300\.000/)).toBeInTheDocument() // tawaran tertinggi
    expect(first.getByText(/200\.000/)).toBeInTheDocument() // harga awal
    expect(first.getByText(/^Sisa/)).toBeInTheDocument()
    expect(first.getByAltText('Keyboard Gaming RGB')).toBeInTheDocument()
    expect(within(card('Oculus Quest 2')).queryByRole('img')).not.toBeInTheDocument()
    expect(within(card('Kamera Lama')).getByText('Ditutup')).toBeInTheDocument()
  })

  it('menampilkan status memuat dan keadaan kosong', async () => {
    const pending = deferred()
    api.getAucations.mockReturnValue(pending.promise)
    await render()
    expect(screen.getByText('Memuat lelang…')).toBeInTheDocument()
    pending.resolve({ status: 'success', data: { aucations: [] } })
    expect(await screen.findByText('Belum ada lelang yang cocok')).toBeInTheDocument()
  })

  it('pencarian langsung memfilter judul atau deskripsi', async () => {
    await render()
    await waitFor(() => expect(cards()).toHaveLength(3))
    const search = screen.getByLabelText('Cari lelang')
    await fireEvent.update(search, 'KEYBOARD')
    expect(cards()).toHaveLength(1)
    await fireEvent.update(search, 'second')
    expect(within(cards()[0]).getByText('Oculus Quest 2')).toBeInTheDocument()
    await fireEvent.update(search, 'tidak ada')
    expect(screen.getByText('Belum ada lelang yang cocok')).toBeInTheDocument()
  })

  it.each([
    ['Lelang Saya', { is_me: 1 }, 'mine'],
    ['Lelang Berlangsung', { is_closed: 1 }, 'open'],
    ['Lelang Ditutup', { is_closed: 0 }, 'closed'],
  ])('tab %s memuat ulang dengan filter yang sesuai', async (label, params, key) => {
    const { router } = await render()
    await waitFor(() => expect(cards()).toHaveLength(3))
    await fireEvent.click(screen.getByRole('tab', { name: label }))
    await waitFor(() => expect(api.getAucations).toHaveBeenLastCalledWith(params))
    expect(router.currentRoute.value.query.tab).toBe(key)
    expect(screen.getByRole('tab', { name: label })).toHaveAttribute('aria-selected', 'true')
    await fireEvent.click(screen.getByRole('tab', { name: 'Semua Lelang' }))
    await waitFor(() => expect(api.getAucations).toHaveBeenLastCalledWith({}))
    expect(router.currentRoute.value.query.tab).toBeUndefined()
  })

  it('tab awal diambil dari query dan tab tidak dikenal kembali ke semua', async () => {
    const { unmount } = await render('/?tab=mine')
    await waitFor(() => expect(api.getAucations).toHaveBeenCalledWith({ is_me: 1 }))
    unmount()
    await render('/?tab=aneh')
    await waitFor(() => expect(api.getAucations).toHaveBeenLastCalledWith({}))
  })

  it('tombol hapus semua hanya muncul di tab Lelang Saya yang berisi data', async () => {
    const { unmount } = await render()
    await waitFor(() => expect(cards()).toHaveLength(3))
    expect(screen.queryByRole('button', { name: /hapus semua/i })).not.toBeInTheDocument()
    unmount()

    api.getAucations.mockResolvedValue({ status: 'success', data: { aucations: [] } })
    const second = await render('/?tab=mine')
    await screen.findByText('Belum ada lelang yang cocok')
    expect(screen.queryByRole('button', { name: /hapus semua/i })).not.toBeInTheDocument()
    second.unmount()

    api.getAucations.mockResolvedValue({ status: 'success', data: { aucations: list } })
    await render('/?tab=mine')
    expect(await screen.findByRole('button', { name: /hapus semua lelang saya/i })).toBeInTheDocument()
  })

  it('hapus semua: berhasil, gagal, dan dibatalkan', async () => {
    await render('/?tab=mine')
    const button = await screen.findByRole('button', { name: /hapus semua lelang saya/i })

    await fireEvent.click(button)
    await waitFor(() => expect(api.deleteAllAucations).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(api.getAucations).toHaveBeenCalledTimes(2))

    api.deleteAllAucations.mockResolvedValue({ status: 'fail', message: 'Unauthenticated.' })
    await fireEvent.click(button)
    await waitFor(() => expect(Swal.fire.mock.calls.at(-1)[0]).toMatchObject({ icon: 'error', text: 'Unauthenticated.' }))

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false })
    await fireEvent.click(button)
    await waitFor(() => expect(Swal.fire.mock.calls.at(-1)[0].icon).toBe('warning'))
    expect(api.deleteAllAucations).toHaveBeenCalledTimes(2)
  })

  it('hanya pemilik melihat tombol hapus; peserta melihat tombol tawar jika lelang masih berlangsung', async () => {
    await render()
    await waitFor(() => expect(cards()).toHaveLength(3))
    expect(within(card('Keyboard Gaming RGB')).getByLabelText('Hapus lelang')).toBeInTheDocument()
    expect(within(card('Keyboard Gaming RGB')).queryByRole('button', { name: 'Tawar' })).not.toBeInTheDocument()
    expect(within(card('Oculus Quest 2')).getByRole('button', { name: 'Tawar' })).toBeInTheDocument()
    expect(within(card('Oculus Quest 2')).queryByLabelText('Hapus lelang')).not.toBeInTheDocument()
    expect(within(card('Kamera Lama')).queryByRole('button')).not.toBeInTheDocument()
    expect(within(card('Oculus Quest 2')).getAllByRole('link')[0]).toHaveAttribute('href', '/aucations/2')
  })

  it('hapus lelang: berhasil memuat ulang, gagal menampilkan error, batal tidak melakukan apa pun', async () => {
    await render()
    await waitFor(() => expect(cards()).toHaveLength(3))
    const trash = within(card('Keyboard Gaming RGB')).getByLabelText('Hapus lelang')

    await fireEvent.click(trash)
    await waitFor(() => expect(api.deleteAucation).toHaveBeenCalledWith(1))
    await waitFor(() => expect(api.getAucations).toHaveBeenCalledTimes(2))

    api.deleteAucation.mockResolvedValue({ status: 'fail', message: 'Tidak boleh' })
    await fireEvent.click(trash)
    await waitFor(() => expect(Swal.fire.mock.calls.at(-1)[0]).toMatchObject({ icon: 'error', text: 'Tidak boleh' }))

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false })
    await fireEvent.click(trash)
    await waitFor(() => expect(Swal.fire.mock.calls.at(-1)[0].icon).toBe('warning'))
    expect(api.deleteAucation).toHaveBeenCalledTimes(2)
  })

  it('tombol Tawar membuka BidModal, bisa ditutup, dan menyimpan tawaran memuat ulang daftar', async () => {
    await render()
    await waitFor(() => expect(cards()).toHaveLength(3))
    await fireEvent.click(within(card('Oculus Quest 2')).getByRole('button', { name: 'Tawar' }))
    const dialog = screen.getByRole('dialog', { name: 'Ajukan tawaran' })
    await fireEvent.click(within(dialog).getByLabelText('Tutup'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await fireEvent.click(within(card('Oculus Quest 2')).getByRole('button', { name: 'Tawar' }))
    await fireEvent.update(screen.getByLabelText('Nominal tawaranmu (Rp)'), '250000')
    await fireEvent.click(screen.getByRole('button', { name: 'Kirim tawaran' }))
    await waitFor(() => expect(api.addBid).toHaveBeenCalledWith(2, 250000))
    await waitFor(() => expect(api.getAucations).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('tombol Pasang lelang membuka AddModal', async () => {
    await render()
    await fireEvent.click(screen.getByRole('button', { name: /pasang lelang/i }))
    const dialog = screen.getByRole('dialog', { name: 'Tambah lelang' })
    await fireEvent.click(within(dialog).getByLabelText('Tutup'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('query ?add=1 membuka AddModal lalu menghapus query tersebut', async () => {
    const { router } = await render('/?add=1&tab=mine')
    expect(await screen.findByRole('dialog', { name: 'Tambah lelang' })).toBeInTheDocument()
    await waitFor(() => expect(router.currentRoute.value.query).toEqual({ tab: 'mine' }))
  })

  it('query add selain 1 diabaikan', async () => {
    await render('/?add=0')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('menyimpan lelang baru memuat ulang daftar', async () => {
    api.addAucation.mockResolvedValue({ status: 'success', message: 'Berhasil' })
    await render()
    await waitFor(() => expect(cards()).toHaveLength(3))
    await fireEvent.click(screen.getByRole('button', { name: /pasang lelang/i }))
    await fireEvent.update(screen.getByLabelText('Judul barang'), 'Baru')
    const { Editor } = await import('@toast-ui/editor')
    Editor.instances.at(-1).markdown = 'Deskripsi'
    Editor.instances.at(-1).options.events.change()
    await fireEvent.update(screen.getByLabelText('Harga awal (Rp)'), '1000')
    await fireEvent.update(screen.getByLabelText('Lelang ditutup pada'), '2099-01-01T10:00')
    await fireEvent.click(screen.getByRole('button', { name: 'Buat lelang' }))
    await waitFor(() => expect(api.getAucations).toHaveBeenCalledTimes(2))
  })
})
