
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
  validateAucationForm,
} from '../../../../helpers/toolsHelper'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'saved'])

const store = useAucationsStore()
const [title, , resetTitle] = useInput('')
const [description, , resetDescription] = useInput('')
const [startBid, , resetStartBid] = useInput('')
const [closedAt, , resetClosedAt] = useInput('')
const errors = ref({})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetTitle()
      resetDescription()
      resetStartBid()
      resetClosedAt()
      errors.value = {}
    }
  },
)

async function onSubmit() {
  errors.value = validateAucationForm({
    title: title.value,
    description: description.value,
    startBid: startBid.value,
    closedAt: closedAt.value,
  })

  if (Object.keys(errors.value).length > 0) return

  const response = await store.addAucation({
    title: title.value.trim(),
    description: description.value,
    start_bid: Number(startBid.value),
    closed_at: toApiTimestamp(closedAt.value),
  })

  if (isSuccess(response)) {
    await showSuccessDialog(response.message, 'Lelang dibuat')
    emit('saved')
    emit('close')
  } else {
    showErrorDialog(
      extractErrorMessage(response),
      'Gagal membuat lelang',
    )
  }
}
</script>

<template>
  <dialog
    v-if="open"
    open
    class="fixed inset-0 m-0 flex min-h-full w-full max-w-none max-h-none items-start justify-center overflow-y-auto border-0 bg-pine-950/60 p-4"
    aria-modal="true"
    aria-label="Tambah lelang"
  >
    <div class="panel my-8 w-full max-w-2xl p-6 shadow-xl">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-extrabold">
            Pasang lelang baru
          </h2>
          <p class="mt-1 text-sm text-muted">
            Foto cover bisa ditambahkan setelah lelang dibuat.
          </p>
        </div>

        <button
          type="button"
          class="btn btn-ghost !p-2"
          aria-label="Tutup"
          @click="emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <form
        class="mt-6 space-y-5"
        novalidate
        @submit.prevent="onSubmit"
      >
        <div>
          <label class="label" for="add-title">
            Judul barang
          </label>
          <input
            id="add-title"
            v-model="title"
            type="text"
            class="field"
            placeholder="Contoh: Keyboard mekanik 75%"
          />
          <p v-if="errors.title" class="field-error">
            {{ errors.title }}
          </p>
        </div>

        <div>
          <span class="label">Deskripsi</span>
          <MarkdownEditor v-model="description" />
          <p v-if="errors.description" class="field-error">
            {{ errors.description }}
          </p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="label" for="add-start-bid">
              Harga awal (Rp)
            </label>
            <input
              id="add-start-bid"
              v-model="startBid"
              type="number"
              min="0"
              class="field"
              placeholder="100000"
            />
            <p v-if="errors.startBid" class="field-error">
              {{ errors.startBid }}
            </p>
          </div>

          <div>
            <label class="label" for="add-closed-at">
              Lelang ditutup pada
            </label>
            <input
              id="add-closed-at"
              v-model="closedAt"
              type="datetime-local"
              class="field"
            />
            <p v-if="errors.closedAt" class="field-error">
              {{ errors.closedAt }}
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="btn btn-ghost"
            @click="emit('close')"
          >
            Batal
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="store.isAucationAdd"
          >
            {{ store.isAucationAdd ? 'Menyimpan…' : 'Buat lelang' }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>