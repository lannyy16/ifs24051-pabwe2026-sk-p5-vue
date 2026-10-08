import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/vue'
import Swal from 'sweetalert2'
import { Editor } from '@toast-ui/editor'
import ChangeModal from './ChangeModal.vue'
import * as api from '../../api/aucationApi'
import { deferred, makeAucation, renderWithProviders } from '../../../../test-utils'

vi.mock('../../api/aucationApi')

const aucation = makeAucation({ id: 9, title: 'Judul Lama', description: 'Deskripsi lama', start_bid: 100000, closed_at: '2099-01-02 03:04:05' })
const open = (props = {}) => renderWithProviders(ChangeModal, { props: { open: true, aucation, ...props } })
const save = () => fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }))

describe('ChangeModal', () => {
  beforeEach(() => api.changeAucation.mockResolvedValue({ status: 'success', message: 'Berhasil mengubah data' }))

  it('tidak merender apa pun saat tertutup', async () => {
    await open({ open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('terisi dengan data lelang saat terbuka', async () => {
    await open()
    expect(screen.getByLabelText('Judul barang')).toHaveValue('Judul Lama')
    expect(screen.getByLabelText('Harga awal (Rp)')).toHaveValue(100000)
    expect(screen.getByLabelText('Lelang ditutup pada')).toHaveValue('2099-01-02T03:04')
    expect(Editor.instances[0].options.initialValue).toBe('Deskripsi lama')
  })

  it('terisi ulang ketika dibuka setelah tertutup', async () => {
    const { rerender } = await open({ open: false })
    await rerender({ open: true })
    expect(screen.getByLabelText('Judul barang')).toHaveValue('Judul Lama')
  })

  it('validasi menolak data kosong', async () => {
    await open()
    await fireEvent.update(screen.getByLabelText('Judul barang'), '')
    await fireEvent.update(screen.getByLabelText('Harga awal (Rp)'), '0')
    await fireEvent.update(screen.getByLabelText('Lelang ditutup pada'), '2000-01-01T00:00')
    const editor = Editor.instances[0]
    editor.markdown = ''
    editor.options.events.change()
    await save()
    expect(screen.getByText('Judul wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Deskripsi wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Harga awal harus lebih dari 0')).toBeInTheDocument()
    expect(screen.getByText('Batas waktu harus di masa depan')).toBeInTheDocument()
    expect(api.changeAucation).not.toHaveBeenCalled()
  })

  it('berhasil menyimpan perubahan', async () => {
    const { emitted } = await open()
    await fireEvent.update(screen.getByLabelText('Judul barang'), ' Judul Baru ')
    await save()
    await waitFor(() => expect(emitted().close).toHaveLength(1))
    expect(api.changeAucation).toHaveBeenCalledWith(9, {
      title: 'Judul Baru',
      description: 'Deskripsi lama',
      start_bid: 100000,
      closed_at: '2099-01-02 03:04:00',
    })
    expect(emitted().saved).toHaveLength(1)
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'success', title: 'Lelang diperbarui' })
  })

  it('gagal menyimpan menampilkan dialog error', async () => {
    api.changeAucation.mockResolvedValue({ status: 'fail', message: 'Ditolak' })
    const { emitted } = await open()
    await save()
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled())
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'error', text: 'Ditolak' })
    expect(emitted().close).toBeUndefined()
  })

  it('status menyimpan dan tombol tutup', async () => {
    const pending = deferred()
    api.changeAucation.mockReturnValue(pending.promise)
    const { emitted } = await open()
    await save()
    expect(await screen.findByRole('button', { name: 'Menyimpan…' })).toBeDisabled()
    pending.resolve({ status: 'fail', message: 'x' })
    await fireEvent.click(screen.getByRole('button', { name: 'Batal' }))
    await fireEvent.click(screen.getByLabelText('Tutup'))
    expect(emitted().close).toHaveLength(2)
  })
})
