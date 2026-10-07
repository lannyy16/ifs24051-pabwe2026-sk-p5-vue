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
        <h2 class="text-xl font-bold text-slate-900">Tambah Lelang</h2>
        <button type="button" class="text-slate-400" @click="$emit('close')">✕</button>
      </div>

      <div class="mt-5 space-y-4">
        <input
          v-model="form.title"
          required
          placeholder="Judul"
          class="w-full rounded-xl border border-slate-200 px-4 py-3"
        />

        <textarea
          v-model="form.description"
          required
          placeholder="Deskripsi"
          class="min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3"
        />

        <input
          v-model.number="form.start_bid"
          required
          min="0"
          type="number"
          placeholder="Harga awal"
          class="w-full rounded-xl border border-slate-200 px-4 py-3"
        />

        <input
          v-model="form.closed_at"
          required
          type="datetime-local"
          class="w-full rounded-xl border border-slate-200 px-4 py-3"
        />

        <input
          type="file"
          accept="image/*"
          required
          class="w-full rounded-xl border border-slate-200 p-3"
          @change="form.cover = $event.target.files[0]"
        />
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-xl px-4 py-2 font-semibold text-slate-600"
          @click="$emit('close')"
        >
          Batal
        </button>
        <button
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

function submit() {
  emit('submit', { ...form })
}
</script>
