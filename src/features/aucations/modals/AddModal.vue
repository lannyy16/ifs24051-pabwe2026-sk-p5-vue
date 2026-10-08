<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
  >
    <form
      class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      @submit.prevent="submit"
    >
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            Tambah Lelang
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Masukkan informasi barang yang akan dilelang.
          </p>
        </div>

        <button
          type="button"
          class="text-slate-400 transition hover:text-slate-700"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="mt-6 space-y-4">
        <div>
          <label
            class="mb-2 block text-sm font-semibold text-slate-700"
          >
            Judul Barang
          </label>

          <input
            v-model="form.title"
            required
            type="text"
            placeholder="Contoh: Jeep"
            class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            class="mb-2 block text-sm font-semibold text-slate-700"
          >
            Deskripsi
          </label>

          <textarea
            v-model="form.description"
            required
            placeholder="Jelaskan kondisi dan informasi barang..."
            class="min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          ></textarea>
        </div>

        <div>
          <label
            class="mb-2 block text-sm font-semibold text-slate-700"
          >
            Harga Awal
          </label>

          <input
            v-model.number="form.start_bid"
            required
            min="1"
            type="number"
            placeholder="Contoh: 100000"
            class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            class="mb-2 block text-sm font-semibold text-slate-700"
          >
            Batas Waktu Lelang
          </label>

          <input
            v-model="form.closed_at"
            required
            type="datetime-local"
            class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p class="mt-1 text-xs text-slate-400">
            Pilih tanggal dan waktu berakhirnya lelang.
          </p>
        </div>

        <div>
          <label
            class="mb-2 block text-sm font-semibold text-slate-700"
          >
            Cover Barang
          </label>

          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            required
            class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
            @change="handleFileChange"
          />

          <p
            v-if="form.cover"
            class="mt-2 text-sm text-emerald-600"
          >
            ✓ {{ form.cover.name }}
          </p>

          <p
            v-else
            class="mt-2 text-sm text-slate-500"
          >
            Pilih gambar barang yang akan dilelang.
          </p>
        </div>
      </div>

      <div
        class="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5"
      >
        <button
          type="button"
          class="rounded-xl px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-100"
          @click="$emit('close')"
        >
          Batal
        </button>

        <button
          type="submit"
          :disabled="loading"
          class="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
} from 'vue'

defineProps({
  open: Boolean,
  loading: Boolean,
})

const emit = defineEmits([
  'close',
  'submit',
])

const fileInput = ref(null)

const form = reactive({
  title: '',
  description: '',
  start_bid: '',
  closed_at: '',
  cover: null,
})

function handleFileChange(event) {
  const file =
    event.target.files?.[0] || null

  form.cover = file
}

function formatClosedAt(value) {
  if (!value) {
    return ''
  }

  if (value.length === 16) {
    return `${value.replace('T', ' ')}:00`
  }

  return value.replace('T', ' ')
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.start_bid = ''
  form.closed_at = ''
  form.cover = null

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function submit() {
  if (!form.title.trim()) {
    return
  }

  if (!form.description.trim()) {
    return
  }

  if (!form.start_bid || Number(form.start_bid) <= 0) {
    return
  }

  if (!form.closed_at) {
    return
  }

  if (!form.cover) {
    return
  }

  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    start_bid: Number(form.start_bid),
    closed_at: formatClosedAt(
      form.closed_at,
    ),
    cover: form.cover,
  })
}

defineExpose({
  resetForm,
})
</script>