import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/vue'
import Swal from 'sweetalert2'
import BidModal from './BidModal.vue'
import * as api from '../../api/aucationApi'
import { deferred, makeAucation, renderWithProviders } from '../../../../test-utils'

vi.mock('../../api/aucationApi')

const withBids = makeAucation({ id: 2, start_bid: 100000, bids: [{ id: 1, bid: 150000 }, { id: 2, bid: 120000 }] })
const open = (aucation = withBids, extra = {}) => renderWithProviders(BidModal, { props: { open: true, aucation, ...extra } })
const amount = () => screen.getByLabelText('Nominal tawaranmu (Rp)')
const send = () => fireEvent.click(screen.getByRole('button', { name: 'Kirim tawaran' }))

describe('BidModal', () => {
  beforeEach(() => api.addBid.mockResolvedValue({ status: 'success', message: 'Berhasil memberikan tawaran' }))

  it('tidak merender apa pun saat tertutup', async () => {
    await open(withBids, { open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('menampilkan tawaran tertinggi dan batas minimum (ada tawaran)', async () => {
    await open()
    expect(screen.getByText(/150\.000/, { selector: 'p.text-xl' })).toBeInTheDocument()
    expect(screen.getByText(/Minimal.*150\.001/)).toBeInTheDocument()
    expect(screen.getByText('Keyboard Gaming RGB')).toBeInTheDocument()
  })

  it('minimum sama dengan harga awal jika belum ada tawaran', async () => {
    await open(makeAucation({ start_bid: 75000, bids: [] }))
    expect(screen.getByText(/Minimal.*75\.000/)).toBeInTheDocument()
  })

  it('validasi: kosong dan di bawah minimum', async () => {
    await open()
    await send()
    expect(screen.getByText('Nominal tawaran wajib diisi')).toBeInTheDocument()
    await fireEvent.update(amount(), '100000')
    await send()
    expect(screen.getByText(/Tawaran minimal.*150\.001/)).toBeInTheDocument()
    expect(api.addBid).not.toHaveBeenCalled()
  })

  it('tawaran valid terkirim dan menutup modal', async () => {
    const { emitted } = await open()
    await fireEvent.update(amount(), '200000')
    await send()
    await waitFor(() => expect(emitted().close).toHaveLength(1))
    expect(api.addBid).toHaveBeenCalledWith(2, 200000)
    expect(emitted().saved).toHaveLength(1)
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'success', title: 'Tawaran terkirim' })
  })

  it('tawaran gagal menampilkan dialog error', async () => {
    api.addBid.mockResolvedValue({ status: 'fail', message: 'Lelang sudah ditutup' })
    const { emitted } = await open()
    await fireEvent.update(amount(), '200000')
    await send()
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled())
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'error', text: 'Lelang sudah ditutup' })
    expect(emitted().close).toBeUndefined()
  })

  it('status mengirim dan tombol tutup', async () => {
    const pending = deferred()
    api.addBid.mockReturnValue(pending.promise)
    const { emitted } = await open()
    await fireEvent.update(amount(), '200000')
    await send()
    expect(await screen.findByRole('button', { name: 'Mengirim…' })).toBeDisabled()
    pending.resolve({ status: 'fail', message: 'x' })
    await fireEvent.click(screen.getByRole('button', { name: 'Batal' }))
    await fireEvent.click(screen.getByLabelText('Tutup'))
    expect(emitted().close).toHaveLength(2)
  })

  it('direset ketika dibuka kembali', async () => {
    const { rerender } = await open()
    await send()
    expect(screen.getByText('Nominal tawaran wajib diisi')).toBeInTheDocument()
    await rerender({ open: false })
    await rerender({ open: true })
    expect(screen.queryByText('Nominal tawaran wajib diisi')).not.toBeInTheDocument()
    expect(amount()).toHaveValue(null)
  })
})
