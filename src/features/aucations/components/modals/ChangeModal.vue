<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import MarkdownEditor from '../MarkdownEditor.vue'
import { useInput } from '../../../../hooks/useInput'
import { useAucationsStore } from '../../states/aucationsStore'
import { isSuccess } from '../../../../helpers/apiHelper'
import {
  extractErrorMessage,
  showErrorDialog,
  showSuccessDialog,
  toApiTimestamp,
  toInputDatetime,
  validateAucationForm,
} from '../../../../helpers/toolsHelper'

const props = defineProps({
  open: { type: Boolean, default: false },
  aucation: { type: Object, required: true },
})
const emit = defineEmits(['close', 'saved'])

const store = useAucationsStore()
const [title, onTitleChange] = useInput('')
const [description, onDescriptionChange] = useInput('')
const [startBid, onStartBidChange] = useInput('')
const [closedAt, onClosedAtChange] = useInput('')
const errors = ref({})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      onTitleChange(props.aucation.title)
      onDescriptionChange(props.aucation.description)
      onStartBidChange(String(props.aucation.start_bid))
      onClosedAtChange(toInputDatetime(props.aucation.closed_at))
      errors.value = {}
    }
  },
  { immediate: true },
)

async function onSubmit() {
  errors.value = validateAucationForm({
    title: title.value,
    description: description.value,
    startBid: startBid.value,
    closedAt: closedAt.value,
  })
  if (Object.keys(errors.value).length > 0) return

  const response = await store.changeAucation(props.aucation.id, {
    title: title.value.trim(),
    description: description.value,
    start_bid: Number(startBid.value),
    closed_at: toApiTimestamp(closedAt.value),
  })
  if (isSuccess(response)) {
    await showSuccessDialog(response.message, 'Lelang diperbarui')
    emit('saved')
    emit('close')
  } else {
    showErrorDialog(extractErrorMessage(response), 'Gagal memperbarui lelang')
  }
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-pine-950/60 p-4" role="dialog" aria-modal="true" aria-label="Ubah lelang">
    <div class="panel my-8 w-full max-w-2xl p-6 shadow-xl">
      <div class="flex items-start justify-between gap-4">
        <h2 class="text-xl font-extrabold">Ubah lelang</h2>
        <button type="button" class="btn btn-ghost !p-2" aria-label="Tutup" @click="emit('close')"><X :size="18" /></button>
      </div>

      <form class="mt-6 space-y-5" novalidate @submit.prevent="onSubmit">
        <div>
          <label class="label" for="change-title">Judul barang</label>
          <input id="change-title" v-model="title" type="text" class="field" />
          <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
        </div>
        <div>
          <span class="label">Deskripsi</span>
          <MarkdownEditor v-model="description" />
          <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="label" for="change-start-bid">Harga awal (Rp)</label>
            <input id="change-start-bid" v-model="startBid" type="number" min="0" class="field" />
            <p v-if="errors.startBid" class="field-error">{{ errors.startBid }}</p>
          </div>
          <div>
            <label class="label" for="change-closed-at">Lelang ditutup pada</label>
            <input id="change-closed-at" v-model="closedAt" type="datetime-local" class="field" />
            <p v-if="errors.closedAt" class="field-error">{{ errors.closedAt }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" class="btn btn-ghost" @click="emit('close')">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="store.isAucationChange">
            {{ store.isAucationChange ? 'Menyimpan…' : 'Simpan perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
