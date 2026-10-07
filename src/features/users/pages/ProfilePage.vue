<template>
  <section class="max-w-3xl">
    <div class="mb-6">
      <p class="text-sm font-semibold text-indigo-600">Akun</p>
      <h1 class="text-3xl font-bold text-slate-900">Profil Saya</h1>
    </div>

    <div class="rounded-3xl bg-white p-6 shadow-sm">
      <div v-if="store.loading && !store.me" class="text-slate-500">
        Memuat profil...
      </div>

      <form v-else class="space-y-5" @submit.prevent="save">
        <div>
          <label class="text-sm font-semibold text-slate-700">Nama</label>
          <input
            v-model="form.name"
            class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </div>

        <div>
          <label class="text-sm font-semibold text-slate-700">Username</label>
          <input
            :value="store.me?.username || ''"
            disabled
            class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3"
          />
        </div>

        <button
          class="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          :disabled="store.loading"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import { useUsersStore } from '../states/usersStore'
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper'

const store = useUsersStore()

const form = reactive({
  name: '',
})

watch(
  () => store.me,
  (value) => {
    form.name = value?.name || ''
  },
  { immediate: true },
)

onMounted(() => {
  store.fetchMe().catch(() => {})
})

async function save() {
  try {
    await store.updateMe(form)
    await showSuccessDialog('Berhasil', 'Profil berhasil diperbarui.')
  } catch (error) {
    await showErrorDialog('Gagal', error.message)
  }
}
</script>
