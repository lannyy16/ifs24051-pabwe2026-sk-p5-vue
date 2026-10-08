import Swal from 'sweetalert2'

export function showSuccessDialog(
  title = 'Berhasil',
  text = '',
) {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
  })
}

export function showErrorDialog(
  title = 'Terjadi Kesalahan',
  text = '',
) {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
  })
}

export function showConfirmDialog(
  title = 'Apakah kamu yakin?',
  text = '',
) {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  })
}

export function formatRupiah(value = 0) {
  const number = Number(value) || 0

  const formatted = new Intl.NumberFormat(
    'id-ID',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  ).format(number)

  return `Rp ${formatted}`
}

export function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(date)
}