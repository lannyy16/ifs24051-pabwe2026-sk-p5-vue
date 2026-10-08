import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const { fireMock } = vi.hoisted(() => ({
  fireMock: vi.fn(),
}))

vi.mock('sweetalert2', () => ({
  default: {
    fire: fireMock,
  },
}))

import {
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
  formatRupiah,
  formatDate,
} from './toolsHelper'

describe('toolsHelper', () => {
  beforeEach(() => {
    fireMock.mockReset()

    fireMock.mockResolvedValue({
      isConfirmed: true,
    })
  })

  describe('showSuccessDialog', () => {
    it('menampilkan dialog sukses dengan title dan text', async () => {
      await showSuccessDialog(
        'Berhasil',
        'Data berhasil disimpan',
      )

      expect(fireMock).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data berhasil disimpan',
        confirmButtonText: 'OK',
      })
    })

    it('menggunakan nilai default', async () => {
      await showSuccessDialog()

      expect(fireMock).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Berhasil',
        text: '',
        confirmButtonText: 'OK',
      })
    })

    it('mengembalikan hasil dari Swal.fire', async () => {
      const result = await showSuccessDialog(
        'Berhasil',
        'Sukses',
      )

      expect(result).toEqual({
        isConfirmed: true,
      })
    })
  })

  describe('showErrorDialog', () => {
    it('menampilkan dialog error dengan title dan text', async () => {
      await showErrorDialog(
        'Gagal',
        'Terjadi kesalahan',
      )

      expect(fireMock).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan',
        confirmButtonText: 'OK',
      })
    })

    it('menggunakan nilai default', async () => {
      await showErrorDialog()

      expect(fireMock).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: '',
        confirmButtonText: 'OK',
      })
    })

    it('mengembalikan hasil dari Swal.fire', async () => {
      const result = await showErrorDialog(
        'Gagal',
        'Error',
      )

      expect(result).toEqual({
        isConfirmed: true,
      })
    })
  })

  describe('showConfirmDialog', () => {
    it('menampilkan dialog konfirmasi dengan title dan text', async () => {
      await showConfirmDialog(
        'Hapus data?',
        'Data akan dihapus',
      )

      expect(fireMock).toHaveBeenCalledWith({
        icon: 'warning',
        title: 'Hapus data?',
        text: 'Data akan dihapus',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
      })
    })

    it('menggunakan nilai default', async () => {
      await showConfirmDialog()

      expect(fireMock).toHaveBeenCalledWith({
        icon: 'warning',
        title: 'Apakah kamu yakin?',
        text: '',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
      })
    })

    it('mengembalikan hasil dari Swal.fire', async () => {
      const result = await showConfirmDialog(
        'Konfirmasi',
        'Lanjutkan?',
      )

      expect(result).toEqual({
        isConfirmed: true,
      })
    })
  })

  describe('formatRupiah', () => {
    it('memformat angka menjadi format rupiah', () => {
      expect(formatRupiah(500000)).toBe(
        'Rp 500.000',
      )
    })

    it('memformat angka satu juta', () => {
      expect(formatRupiah(1000000)).toBe(
        'Rp 1.000.000',
      )
    })

    it('memformat angka string', () => {
      expect(formatRupiah('750000')).toBe(
        'Rp 750.000',
      )
    })

    it('membulatkan angka desimal', () => {
      expect(formatRupiah(1250000.75)).toBe(
        'Rp 1.250.001',
      )
    })

    it('menggunakan 0 untuk nilai tidak valid', () => {
      expect(formatRupiah('abc')).toBe(
        'Rp 0',
      )
    })

    it('menggunakan 0 untuk null', () => {
      expect(formatRupiah(null)).toBe(
        'Rp 0',
      )
    })

    it('menggunakan 0 untuk undefined', () => {
      expect(formatRupiah(undefined)).toBe(
        'Rp 0',
      )
    })

    it('menggunakan nilai default 0', () => {
      expect(formatRupiah()).toBe(
        'Rp 0',
      )
    })
  })

  describe('formatDate', () => {
    it('mengembalikan tanda - jika value kosong', () => {
      expect(formatDate('')).toBe('-')
      expect(formatDate(null)).toBe('-')
      expect(formatDate(undefined)).toBe('-')
    })

    it('mengembalikan value asli jika tanggal tidak valid', () => {
      expect(
        formatDate('tanggal-tidak-valid'),
      ).toBe('tanggal-tidak-valid')
    })

    it('memformat tanggal yang valid', () => {
      const result = formatDate(
        '2026-10-09T08:01:00',
      )

      expect(result).not.toBe('-')
      expect(result).not.toBe(
        '2026-10-09T08:01:00',
      )
      expect(result).toContain('2026')
    })

    it('memformat tanggal dengan format API', () => {
      const result = formatDate(
        '2026-10-09 08:01:00',
      )

      expect(result).not.toBe('-')
      expect(result).toContain('2026')
    })
  })
})