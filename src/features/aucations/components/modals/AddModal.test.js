import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/vue'
import Swal from 'sweetalert2'
import { Editor } from '@toast-ui/editor'
import AddModal from './AddModal.vue'
import * as api from '../../api/aucationApi'
import { deferred, renderWithProviders } from '../../../../test-utils'

vi.mock('../../api/aucationApi')

const open = () => renderWithProviders(AddModal, { props: { open: true } })
const writeDescription = (text) => {
  const editor = Editor.instances.at(-1)
  editor.markdown = text
  editor.options.events.change()
}
const fillAll = async () => {
  await fireEvent.update(screen.getByLabelText('Judul barang'), '  Laptop ')
  writeDescription('Masih mulus')
  await fireEvent.update(screen.getByLabelText('Harga awal (Rp)'), '500000')
  await fireEvent.update(screen.getByLabelText('Lelang ditutup pada'), '2099-06-01T10:00')
}
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Buat lelang' }))

describe('AddModal', () => {
  beforeEach(() => api.addAucation.mockResolvedValue({ status: 'success', message: 'Berhasil menambahkan' }))

  it('tidak merender apa pun saat tertutup', async () => {
    await renderWithProviders(AddModal)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('menampilkan error validasi', async () => {
    await open()
    await submit()
    expect(screen.getByText('Judul wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Deskripsi wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Harga awal harus lebih dari 0')).toBeInTheDocument()
    expect(screen.getByText('Batas waktu wajib diisi')).toBeInTheDocument()
    expect(api.addAucation).not.toHaveBeenCalled()
  })

  it('berhasil membuat lelang, lalu emit saved dan close', async () => {
    const { emitted } = await open()
    await fillAll()
    await submit()
    await waitFor(() => expect(emitted().close).toHaveLength(1))
    expect(api.addAucation).toHaveBeenCalledWith({
      title: 'Laptop',
      description: 'Masih mulus',
      start_bid: 500000,
      closed_at: '2099-06-01 10:00:00',
    })
    expect(emitted().saved).toHaveLength(1)
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'success', title: 'Lelang dibuat' })
  })

  it('gagal membuat lelang menampilkan dialog error dan tidak menutup modal', async () => {
    api.addAucation.mockResolvedValue({ status: 'fail', message: 'Data tidak valid', data: { title: ['Terlalu panjang'] } })
    const { emitted } = await open()
    await fillAll()
    await submit()
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled())
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'error', text: 'Data tidak valid\nTerlalu panjang' })
    expect(emitted().close).toBeUndefined()
  })

  it('tombol menampilkan status menyimpan', async () => {
    const pending = deferred()
    api.addAucation.mockReturnValue(pending.promise)
    await open()
    await fillAll()
    await submit()
    expect(await screen.findByRole('button', { name: 'Menyimpan…' })).toBeDisabled()
    pending.resolve({ status: 'fail', message: 'x' })
  })

  it('tombol batal dan tutup mengirim close', async () => {
    const { emitted } = await open()
    await fireEvent.click(screen.getByRole('button', { name: 'Batal' }))
    await fireEvent.click(screen.getByLabelText('Tutup'))
    expect(emitted().close).toHaveLength(2)
  })

  it('form direset setiap kali dibuka kembali', async () => {
    const { rerender } = await open()
    await fireEvent.update(screen.getByLabelText('Judul barang'), 'Sisa')
    await submit()
    expect(screen.getByText('Deskripsi wajib diisi')).toBeInTheDocument()
    await rerender({ open: false })
    await rerender({ open: true })
    expect(screen.getByLabelText('Judul barang')).toHaveValue('')
    expect(screen.queryByText('Deskripsi wajib diisi')).not.toBeInTheDocument()
  })
})
