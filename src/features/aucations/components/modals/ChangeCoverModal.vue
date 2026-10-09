<script setup>
import { ref, watch } from 'vue'
import { ImagePlus, X } from 'lucide-vue-next'
import { useAucationsStore } from '../../states/aucationsStore'
import { isSuccess } from '../../../../helpers/apiHelper'
import {
  extractErrorMessage,
  resolveImageUrl,
  showErrorDialog,
  showSuccessDialog,
} from '../../../../helpers/toolsHelper'

const MAX_SIZE = 2 * 1024 * 1024

const props = defineProps({
  open: { type: Boolean, default: false },
  aucation: { type: Object, required: true },
})

const emit = defineEmits(['close', 'saved'])

const store = useAucationsStore()
const file = ref(null)
const preview = ref('')
const error = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      file.value = null
      preview.value = resolveImageUrl(props.aucation.cover)
      error.value = ''
    }
  },
  { immediate: true },
)

function onFileChange(event) {
  const selected = event.target.files[0]

  if (!selected) return

  if (!selected.type.startsWith('image/')) {
    error.value = 'Berkas harus berupa gambar'
  } else if (selected.size > MAX_SIZE) {
    error.value = 'Ukuran gambar maksimal 2 MB'
  } else {
    error.value = ''
    file.value = selected
    preview.value = URL.createObjectURL(selected)
  }
}

async function onSubmit() {
  if (!file.value) {
    error.value = 'Pilih gambar cover terlebih dahulu'
    return
  }

  const response = await store.changeCover(
    props.aucation.id,
    file.value,
  )

  if (isSuccess(response)) {
    await showSuccessDialog(response.message, 'Cover diperbarui')
    emit('saved')
    emit('close')
  } else {
    showErrorDialog(
      extractErrorMessage(response),
      'Gagal mengubah cover',
    )
  }
}
</script>

<template>
  <dialog
    v-if="open"
    open
    class="fixed inset-0 z-50 m-0 flex min-h-full w-full max-w-none max-h-none items-center justify-center overflow-y-auto border-0 bg-pine-950/60 p-4"
    aria-modal="true"
    aria-label="Ganti cover"
  >
    <div class="panel w-full max-w-md p-6 shadow-xl">
      <div class="flex items-start justify-between gap-4">
        <h2 class="text-xl font-extrabold">
          Ganti cover barang
        </h2>

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
        class="mt-5 space-y-4"
        novalidate
        @submit.prevent="onSubmit"
      >
        <div
          class="grid aspect-video place-items-center overflow-hidden rounded-lg border border-dashed border-line bg-paper"
        >
          <img
            v-if="preview"
            :src="preview"
            alt="Pratinjau cover"
            class="size-full object-cover"
          />

          <ImagePlus
            v-else
            :size="36"
            class="text-muted"
          />
        </div>

        <div>
          <label class="label" for="cover-file">
            Berkas gambar
          </label>

          <input
            id="cover-file"
            type="file"
            accept="image/*"
            class="field"
            @change="onFileChange"
          />

          <p v-if="error" class="field-error">
            {{ error }}
          </p>
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
            :disabled="store.isAucationChangeCover"
          >
            {{
              store.isAucationChangeCover
                ? 'Mengunggah…'
                : 'Simpan cover'
            }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>