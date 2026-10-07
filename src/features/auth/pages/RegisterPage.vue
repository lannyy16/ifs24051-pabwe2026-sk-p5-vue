<template>
  <div class="rounded-3xl bg-white p-7 shadow-xl">
    <h2 class="text-2xl font-bold text-slate-900">Daftar</h2>
    <p class="mt-1 text-sm text-slate-500">Buat akun Delcom Auction.</p>

    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <div>
        <label class="text-sm font-semibold text-slate-700">Username</label>
        <input
          v-model="form.username"
          class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label class="text-sm font-semibold text-slate-700">Name</label>
        <input
          v-model="form.name"
          class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label class="text-sm font-semibold text-slate-700">Password</label>
        <input
          v-model="form.password"
          type="password"
          class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          required
        />
      </div>

      <p v-if="auth.error" class="text-sm text-red-600">{{ auth.error }}</p>

      <button
        :disabled="auth.loading"
        class="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ auth.loading ? 'Memproses...' : 'Daftar' }}
      </button>
    </form>

    <p class="mt-5 text-center text-sm text-slate-500">
      Sudah punya akun?
      <RouterLink class="font-semibold text-indigo-600" to="/auth/login">
        Masuk
      </RouterLink>
    </p>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../states/authStore'
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  username: '',
  name: '',
  password: '',
})

async function submit() {
  try {
    await auth.register(form)
    await showSuccessDialog('Pendaftaran berhasil', 'Silakan masuk ke akun kamu.')
    await router.push('/auth/login')
  } catch (error) {
    await showErrorDialog('Pendaftaran gagal', error.message)
  }
}
</script>
