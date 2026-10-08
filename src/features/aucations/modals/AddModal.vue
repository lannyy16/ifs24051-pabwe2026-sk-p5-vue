<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
  >
    <form
      class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6"
      @submit.prevent="submit"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-900">
          Tambah Lelang
        </h2>

        <button
          type="button"
          class="text-slate-400 hover:text-slate-700"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="mt-5 space-y-4">
        <!-- Judul -->
        <input
          v-model="form.title"
          required
          type="text"
          placeholder="Judul barang"
          class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
        />

        <!-- Deskripsi -->
        <textarea
          v-model="form.description"
          required
          placeholder="Deskripsi barang"
          class="min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
        ></textarea>

        <!-- Harga Awal -->
        <input
          v-model.number="form.start_bid"
          required
          min="0"
          type="number"
          placeholder="Harga awal"
          class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
        />

        <!-- Waktu Penutupan -->
        <input
          v-model="form.closed_at"
          required
          type="datetime-local"
          class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
        />

        <!-- Cover Barang -->
        <input
          type="file"
          accept="image/*"
          required
          class="w-full rounded-xl border border-slate-200 p-3"
          @change="handleFileChange"
        />

        <p class="text-sm text-slate-500">
          Pilih gambar barang yang akan dilelang.
        </p>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
          @click="$emit('close')"
        >
          Batal
        </button>

        <button
          type="submit"
          :disabled="loading"
          class="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {{ loading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  open: Boolean,
  loading: Boolean,
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  title: '',
  description: '',
  start_bid: '',
  closed_at: '',
  cover: null,
})

function handleFileChange(event) {
  form.cover = event.target.files?.[0] || null
}

function formatClosedAt(value) {
  if (!value) {
    return ''
  }

  return value.replace('T', ' ') + ':00'
}

function submit() {
  emit('submit', {
    ...form,
    closed_at: formatClosedAt(form.closed_at),
  })
}
</script>