import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/vue'
import Swal from 'sweetalert2'
import ChangeCoverModal from './ChangeCoverModal.vue'
import * as api from '../../api/aucationApi'
import { deferred, makeAucation, renderWithProviders } from '../../../../test-utils'

vi.mock('../../api/aucationApi')

const aucation = makeAucation({ id: 4, cover: 'img/aucations/cover/4.jpg' })
const open = (props = {}) => renderWithProviders(ChangeCoverModal, { props: { open: true, aucation, ...props } })
const fileInput = () => screen.getByLabelText('Berkas gambar')
const pick = (file) => fireEvent.change(fileInput(), { target: { files: file ? [file] : [] } })
const image = (size) => {
  const file = new File(['x'], 'c.png', { type: 'image/png' })
  if (size) Object.defineProperty(file, 'size', { value: size })
  return file
}
const save = () => fireEvent.click(screen.getByRole('button', { name: 'Simpan cover' }))

describe('ChangeCoverModal', () => {
  beforeEach(() => api.changeCover.mockResolvedValue({ status: 'success', message: 'Berhasil mengubah cover' }))

  it('tidak merender apa pun saat tertutup', async () => {
    await open({ open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('menampilkan cover saat ini sebagai pratinjau, atau ikon jika belum ada', async () => {
    const { unmount } = await open()
    expect(screen.getByAltText('Pratinjau cover')).toHaveAttribute('src', 'https://open-api.delcom.org/img/aucations/cover/4.jpg')
    unmount()
    await open({ aucation: makeAucation({ cover: '' }) })
    expect(screen.queryByAltText('Pratinjau cover')).not.toBeInTheDocument()
  })

  it('direset ketika dibuka kembali', async () => {
    const { rerender } = await open({ open: false })
    await rerender({ open: true })
    expect(screen.getByAltText('Pratinjau cover')).toBeInTheDocument()
  })

  it('validasi berkas: kosong, bukan gambar, terlalu besar', async () => {
    await open()
    await pick(null)
    expect(screen.queryByText(/Berkas harus/)).not.toBeInTheDocument()
    await pick(new File(['x'], 'a.pdf', { type: 'application/pdf' }))
    expect(screen.getByText('Berkas harus berupa gambar')).toBeInTheDocument()
    await pick(image(3 * 1024 * 1024))
    expect(screen.getByText('Ukuran gambar maksimal 2 MB')).toBeInTheDocument()
  })

  it('submit tanpa berkas menampilkan error', async () => {
    await open()
    await save()
    expect(screen.getByText('Pilih gambar cover terlebih dahulu')).toBeInTheDocument()
    expect(api.changeCover).not.toHaveBeenCalled()
  })

  it('berkas valid: pratinjau berubah dan unggah berhasil', async () => {
    const file = image()
    const { emitted } = await open()
    await pick(file)
    expect(screen.getByAltText('Pratinjau cover')).toHaveAttribute('src', 'blob:preview')
    await save()
    await waitFor(() => expect(emitted().close).toHaveLength(1))
    expect(api.changeCover).toHaveBeenCalledWith(4, file)
    expect(emitted().saved).toHaveLength(1)
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'success', title: 'Cover diperbarui' })
  })

  it('unggah gagal menampilkan dialog error', async () => {
    api.changeCover.mockResolvedValue({ status: 'fail', message: 'Terlalu besar' })
    const { emitted } = await open()
    await pick(image())
    await save()
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled())
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'error', text: 'Terlalu besar' })
    expect(emitted().close).toBeUndefined()
  })

  it('status mengunggah dan tombol tutup', async () => {
    const pending = deferred()
    api.changeCover.mockReturnValue(pending.promise)
    const { emitted } = await open()
    await pick(image())
    await save()
    expect(await screen.findByRole('button', { name: 'Mengunggah…' })).toBeDisabled()
    pending.resolve({ status: 'fail', message: 'x' })
    await fireEvent.click(screen.getByRole('button', { name: 'Batal' }))
    await fireEvent.click(screen.getByLabelText('Tutup'))
    expect(emitted().close).toHaveLength(2)
  })
})
