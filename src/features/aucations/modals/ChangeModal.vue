<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
  >
    <form class="w-full max-w-lg rounded-3xl bg-white p-6" @submit.prevent="submit">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Ubah Lelang</h2>
        <button type="button" @click="$emit('close')">✕</button>
      </div>

      <div class="mt-5 space-y-4">
        <input
          v-model="form.title"
          required
          class="w-full rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Judul"
        />

        <textarea
          v-model="form.description"
          required
          class="min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Deskripsi"
        />

        <input
          v-model.number="form.start_bid"
          required
          type="number"
          min="0"
          class="w-full rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Harga awal"
        />

        <input
          v-model="form.closed_at"
          required
          type="datetime-local"
          class="w-full rounded-xl border border-slate-200 px-4 py-3"
        />
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="rounded-xl px-4 py-2" @click="$emit('close')">
          Batal
        </button>
        <button class="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white">
          {{ loading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  open: Boolean,
  loading: Boolean,
  aucation: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  title: '',
  description: '',
  start_bid: '',
  closed_at: '',
})

watch(
  () => props.aucation,
  (value) => {
    form.title = value?.title || ''
    form.description = value?.description || ''
    form.start_bid = value?.start_bid || ''
    form.closed_at = value?.closed_at
      ? String(value.closed_at).slice(0, 16)
      : ''
  },
  { immediate: true },
)

function submit() {
  emit('submit', { ...form })
}
</script>
