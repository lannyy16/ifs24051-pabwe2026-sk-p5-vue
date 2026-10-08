<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
  >
    <form
      class="w-full max-w-md rounded-3xl bg-white p-6"
      @submit.prevent="submit"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">
          Ajukan Bid
        </h2>

        <button
          type="button"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <input
        v-model.number="bid"
        class="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3"
        type="number"
        min="1"
        required
        placeholder="Nominal bid"
      />

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-xl px-4 py-2"
          @click="$emit('close')"
        >
          Batal
        </button>

        <button
          class="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white"
        >
          {{ loading ? 'Mengirim...' : 'Bid Sekarang' }}
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

const emit = defineEmits([
  'close',
  'submit',
])

const bid = ref('')

function submit() {
  emit(
    'submit',
    bid.value,
  )
}
</script>