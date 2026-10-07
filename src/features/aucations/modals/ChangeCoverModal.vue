<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
  >
    <form class="w-full max-w-md rounded-3xl bg-white p-6" @submit.prevent="submit">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Ganti Cover</h2>
        <button type="button" @click="$emit('close')">✕</button>
      </div>

      <input
        class="mt-6 w-full rounded-xl border border-slate-200 p-3"
        type="file"
        accept="image/*"
        required
        @change="file = $event.target.files[0]"
      />

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="rounded-xl px-4 py-2" @click="$emit('close')">
          Batal
        </button>
        <button class="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white">
          {{ loading ? 'Mengunggah...' : 'Upload' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  open: Boolean,
  loading: Boolean,
})

const emit = defineEmits(['close', 'submit'])
const file = ref(null)

function submit() {
  if (file.value) emit('submit', file.value)
}
</script>
