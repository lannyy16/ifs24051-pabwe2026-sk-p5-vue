import { describe, expect, it } from 'vitest'
import Swal from 'sweetalert2'
import {
  extractErrorMessage,
  formatDate,
  formatRupiah,
  getHighestBid,
  getInitials,
  getMinimumBid,
  getTimeLeft,
  isClosed,
  isValidEmail,
  parseTimestamp,
  resolveImageUrl,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  toApiTimestamp,
  toInputDatetime,
  validateAucationForm,
} from './toolsHelper'

describe('dialog SweetAlert2', () => {
  it('showSuccessDialog & showErrorDialog memakai judul default atau kustom', () => {
    showSuccessDialog('ok')
    showSuccessDialog('ok', 'Judul')
    showErrorDialog('gagal')
    showErrorDialog('gagal', 'Judul')
    const calls = Swal.fire.mock.calls.map(([o]) => [o.icon, o.title])
    expect(calls).toEqual([
      ['success', 'Berhasil'],
      ['success', 'Judul'],
      ['error', 'Terjadi kesalahan'],
      ['error', 'Judul'],
    ])
  })

  it('showConfirmDialog mengembalikan hasil konfirmasi', async () => {
    expect(await showConfirmDialog('hapus?')).toBe(true)
    expect(Swal.fire.mock.calls[0][0].title).toBe('Apakah kamu yakin?')
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false })
    expect(await showConfirmDialog('hapus?', 'Judul')).toBe(false)
    expect(Swal.fire.mock.calls[1][0].title).toBe('Judul')
  })
})

describe('format', () => {
  it('formatRupiah', () => {
    expect(formatRupiah(10000)).toMatch(/Rp\s?10\.000/)
    expect(formatRupiah('abc')).toMatch(/Rp\s?0/)
  })

  it('parseTimestamp menerima format API dan ISO', () => {
    expect(parseTimestamp(null)).toBeNull()
    expect(parseTimestamp('bukan tanggal')).toBeNull()
    expect(parseTimestamp('2024-10-05 22:00:00').getHours()).toBe(22)
    expect(parseTimestamp('2024-10-05T08:34:04.000000Z')).toBeInstanceOf(Date)
  })

  it('formatDate', () => {
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate('2024-10-05 22:00:00')).toMatch(/2024/)
  })

  it('toApiTimestamp & toInputDatetime', () => {
    expect(toApiTimestamp('2026-12-31T23:59')).toBe('2026-12-31 23:59:00')
    expect(toApiTimestamp('2026-12-31T23:59:30')).toBe('2026-12-31 23:59:30')
    expect(toInputDatetime('2026-12-31 23:59:00')).toBe('2026-12-31T23:59')
    expect(toInputDatetime('x')).toBe('')
  })

  it('getInitials', () => {
    expect(getInitials('Abdullah Ubaid Khan')).toBe('AU')
    expect(getInitials('delcom')).toBe('D')
    expect(getInitials('   ')).toBe('?')
    expect(getInitials(undefined)).toBe('?')
  })

  it('resolveImageUrl', () => {
    expect(resolveImageUrl('')).toBe('')
    expect(resolveImageUrl('https://x.test/a.png')).toBe('https://x.test/a.png')
    expect(resolveImageUrl('img/profile/1.png')).toBe('https://open-api.delcom.org/img/profile/1.png')
    expect(resolveImageUrl('/img/profile/1.png')).toBe('https://open-api.delcom.org/img/profile/1.png')
  })

  it('isValidEmail', () => {
    expect(isValidEmail('a@b.co')).toBe(true)
    expect(isValidEmail('a@b')).toBe(false)
  })

  it('extractErrorMessage', () => {
    expect(extractErrorMessage({ message: 'Data tidak valid', data: { email: ['Wajib', 'Salah'], x: 1 } })).toBe(
      'Data tidak valid\nWajib\nSalah',
    )
    expect(extractErrorMessage({ message: 'Gagal' })).toBe('Gagal')
    expect(extractErrorMessage(null)).toBe('Terjadi kesalahan pada server')
  })
})

describe('waktu lelang', () => {
  const now = new Date('2026-01-01T00:00:00')

  it('isClosed', () => {
    expect(isClosed('2000-01-01 00:00:00')).toBe(true)
    expect(isClosed('2999-01-01 00:00:00')).toBe(false)
    expect(isClosed('invalid', now)).toBe(false)
  })

  it('getTimeLeft', () => {
    expect(getTimeLeft(null, now)).toBe('-')
    expect(getTimeLeft('2025-12-31 00:00:00', now)).toBe('Ditutup')
    expect(getTimeLeft('2026-01-03 05:00:00', now)).toBe('2 hari 5 jam')
    expect(getTimeLeft('2026-01-01 03:30:00', now)).toBe('3 jam 30 menit')
    expect(getTimeLeft('2026-01-01 00:20:00', now)).toBe('20 menit')
    expect(getTimeLeft('2999-01-01 00:00:00')).toMatch(/hari/)
  })
})

describe('tawaran', () => {
  it('getHighestBid', () => {
    expect(getHighestBid(null)).toBe(0)
    expect(getHighestBid({ start_bid: 100 })).toBe(100)
    expect(getHighestBid({ start_bid: 100, bids: [2] })).toBe(100)
    expect(getHighestBid({ start_bid: 100, highest_bid: 250, bids: [2] })).toBe(250)
    expect(getHighestBid({ start_bid: 100, bids: [{ bid: 300 }, { bid: 200 }] })).toBe(300)
  })

  it('getMinimumBid', () => {
    expect(getMinimumBid(undefined)).toBe(1)
    expect(getMinimumBid({ start_bid: 100, bids: [] })).toBe(101)
    expect(getMinimumBid({ start_bid: 100, bids: [{ bid: 300 }] })).toBe(301)
  })
})

describe('validateAucationForm', () => {
  const now = new Date('2026-01-01T00:00:00')
  const valid = { title: 'A', description: 'B', startBid: '100', closedAt: '2099-06-01T10:00' }

  it('lolos jika semua valid', () => {
    expect(validateAucationForm(valid, now)).toEqual({})
    expect(validateAucationForm(valid)).toEqual({})
  })

  it('melaporkan semua field kosong', () => {
    expect(validateAucationForm({ title: ' ', description: '', startBid: '0', closedAt: '' }, now)).toEqual({
      title: 'Judul wajib diisi',
      description: 'Deskripsi wajib diisi',
      startBid: 'Harga awal harus lebih dari 0',
      closedAt: 'Batas waktu wajib diisi',
    })
  })

  it('menolak batas waktu yang sudah lewat', () => {
    expect(validateAucationForm({ ...valid, closedAt: '2025-01-01T10:00' }, now).closedAt).toMatch(/masa depan/)
  })
})
