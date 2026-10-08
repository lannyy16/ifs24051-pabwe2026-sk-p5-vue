<script setup>
import { computed, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useInput } from '../../../../hooks/useInput'
import { useAucationsStore } from '../../states/aucationsStore'
import { isSuccess } from '../../../../helpers/apiHelper'
import {
  extractErrorMessage,
  formatRupiah,
  getHighestBid,
  getMinimumBid,
  showErrorDialog,
  showSuccessDialog,
} from '../../../../helpers/toolsHelper'

const props = defineProps({
  open: { type: Boolean, default: false },
  aucation: { type: Object, required: true },
})
const emit = defineEmits(['close', 'saved'])

const store = useAucationsStore()
const [bid, , resetBid] = useInput('')
const error = ref('')

const highestBid = computed(() => getHighestBid(props.aucation))
const minimumBid = computed(() => getMinimumBid(props.aucation))

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetBid()
      error.value = ''
    }
  },
)

async function onSubmit() {
  const amount = Number(bid.value)
  if (!bid.value || !Number.isFinite(amount)) {
    error.value = 'Nominal tawaran wajib diisi'
    return
  }
  if (amount < minimumBid.value) {
    error.value = `Tawaran minimal ${formatRupiah(minimumBid.value)}`
    return
  }
  error.value = ''

  const response = await store.addBid(props.aucation.id, amount)
  if (isSuccess(response)) {
    await showSuccessDialog(response.message, 'Tawaran terkirim')
    emit('saved')
    emit('close')
  } else {
    showErrorDialog(extractErrorMessage(response), 'Gagal mengirim tawaran')
  }
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/60 p-4" role="dialog" aria-modal="true" aria-label="Ajukan tawaran">
    <div class="panel w-full max-w-md p-6 shadow-xl">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-extrabold">Ajukan tawaran</h2>
          <p class="mt-1 text-sm text-muted">{{ aucation.title }}</p>
        </div>
        <button type="button" class="btn btn-ghost !p-2" aria-label="Tutup" @click="emit('close')"><X :size="18" /></button>
      </div>

      <div class="mt-5 rounded-lg bg-brass-100 px-4 py-3 text-sm">
        Tawaran tertinggi saat ini
        <p class="text-xl font-extrabold text-brass-600">{{ formatRupiah(highestBid) }}</p>
      </div>

      <form class="mt-5 space-y-4" novalidate @submit.prevent="onSubmit">
        <div>
          <label class="label" for="bid-amount">Nominal tawaranmu (Rp)</label>
          <input id="bid-amount" v-model="bid" type="number" min="0" class="field" :placeholder="String(minimumBid)" />
          <p class="mt-1 text-xs text-muted">Minimal {{ formatRupiah(minimumBid) }}</p>
          <p v-if="error" class="field-error">{{ error }}</p>
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" class="btn btn-ghost" @click="emit('close')">Batal</button>
          <button type="submit" class="btn btn-brass" :disabled="store.isBidAdd">
            {{ store.isBidAdd ? 'Mengirim…' : 'Kirim tawaran' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
