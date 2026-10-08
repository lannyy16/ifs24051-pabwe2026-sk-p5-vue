import Swal from 'sweetalert2'

const colors = { confirmButtonColor: '#0e3b34', cancelButtonColor: '#5f6f6a' }

export const showSuccessDialog = (message, title = 'Berhasil') =>
  Swal.fire({ icon: 'success', title, text: message, ...colors })

export const showErrorDialog = (message, title = 'Terjadi kesalahan') =>
  Swal.fire({ icon: 'error', title, text: message, ...colors })

/** Mengembalikan true jika pengguna menekan tombol konfirmasi. */
export async function showConfirmDialog(message, title = 'Apakah kamu yakin?') {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya, lanjutkan',
    cancelButtonText: 'Batal',
    ...colors,
  })
  return result.isConfirmed
}

export const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

/** Menerima "2024-10-05 22:00:00" maupun ISO 8601; mengembalikan Date atau null. */
export function parseTimestamp(value) {
  if (!value) return null
  const text = String(value)
  const date = new Date(text.includes('T') ? text : text.replace(' ', 'T'))
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value) {
  const date = parseTimestamp(value)
  if (!date) return '-'
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function isClosed(closedAt, now = new Date()) {
  const date = parseTimestamp(closedAt)
  return date ? date <= now : false
}

export function getTimeLeft(closedAt, now = new Date()) {
  const date = parseTimestamp(closedAt)
  if (!date) return '-'
  const diff = date - now
  if (diff <= 0) return 'Ditutup'
  const minutes = Math.floor(diff / 60000)
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  if (days > 0) return `${days} hari ${hours} jam`
  if (hours > 0) return `${hours} jam ${minutes % 60} menit`
  return `${minutes} menit`
}

/**
 * Tawaran tertinggi saat ini (atau harga awal jika belum ada tawaran).
 * `highest_bid` diisi store untuk daftar lelang, karena API daftar hanya mengirim id tawaran.
 */
export const getHighestBid = (aucation) =>
  Math.max(
    Number(aucation?.start_bid) || 0,
    Number(aucation?.highest_bid) || 0,
    ...(aucation?.bids ?? []).map((b) => Number(b?.bid) || 0),
  )

/** Nominal minimum tawaran berikutnya: harus lebih tinggi dari tawaran tertinggi saat ini. */
export const getMinimumBid = (aucation) => getHighestBid(aucation) + 1

/** "2026-12-31T23:59" (input datetime-local) -> "2026-12-31 23:59:00". */
export function toApiTimestamp(value) {
  const text = String(value).replace('T', ' ')
  return text.length === 16 ? `${text}:00` : text
}

/** "2026-12-31 23:59:00" -> "2026-12-31T23:59" (untuk input datetime-local). */
export function toInputDatetime(value) {
  const date = parseTimestamp(value)
  if (!date) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())

/** Menggabungkan pesan utama dan detail validasi dari respons gagal. */
export function extractErrorMessage(response) {
  const details = Object.values(response?.data ?? {})
    .flat()
    .filter((item) => typeof item === 'string')
  const message = response?.message || 'Terjadi kesalahan pada server'
  return details.length ? `${message}\n${details.join('\n')}` : message
}

/** Path relatif dari API (mis. "img/profile/1.png") dijadikan URL absolut. */
export function resolveImageUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${new URL(DELCOM_BASEURL).origin}/${String(path).replace(/^\//, '')}`
}

export const getInitials = (name) =>
  String(name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?'

/** Validasi form lelang (dipakai AddModal & ChangeModal). Mengembalikan objek error. */
export function validateAucationForm({ title, description, startBid, closedAt }, now = new Date()) {
  const errors = {}
  if (!String(title).trim()) errors.title = 'Judul wajib diisi'
  if (!String(description).trim()) errors.description = 'Deskripsi wajib diisi'
  if (!(Number(startBid) > 0)) errors.startBid = 'Harga awal harus lebih dari 0'
  const closeDate = parseTimestamp(toApiTimestamp(closedAt || ''))
  if (!closedAt) errors.closedAt = 'Batas waktu wajib diisi'
  else if (closeDate <= now) errors.closedAt = 'Batas waktu harus di masa depan'
  return errors
}
