<template>
  <div class="min-h-screen bg-slate-950 px-6 py-10">
    <div
      class="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center"
    >
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg shadow-indigo-900/40"
        >
          DA
        </div>

        <h1 class="text-3xl font-bold tracking-tight text-white">
          Delcom Auction
        </h1>

        <p class="mt-2 text-base text-indigo-300">
          Aplikasi lelang sederhana
        </p>
      </div>

      <div
        class="rounded-3xl bg-white p-8 shadow-2xl shadow-black/30 sm:p-9"
      >
        <div class="mb-7">
          <h2 class="text-3xl font-bold text-slate-900">
            Daftar
          </h2>

          <p class="mt-2 text-base text-slate-500">
            Buat akun Delcom Auction.
          </p>
        </div>

        <div
          v-if="authStore.error"
          class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ authStore.error }}
        </div>

        <form
          class="space-y-5"
          @submit.prevent="handleSubmit"
        >
          <div>
            <label
              for="name"
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              Name
            </label>

            <input
              id="name"
              v-model="name"
              type="text"
              autocomplete="name"
              placeholder="Masukkan nama lengkap"
              required
              class="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              for="email"
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="contoh@email.com"
              required
              class="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              for="password"
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Masukkan password"
                required
                class="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              v-if="authStore.loading"
              class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>

            <span>
              {{ authStore.loading ? 'Mendaftarkan...' : 'Daftar' }}
            </span>
          </button>
        </form>

        <div
          class="mt-7 border-t border-slate-100 pt-6 text-center"
        >
          <p class="text-sm text-slate-500">
            Sudah punya akun?

            <RouterLink
              to="/auth/login"
              class="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
            >
              Masuk
            </RouterLink>
          </p>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-slate-500">
        © 2026 Delcom Auction. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../states/authStore'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleSubmit() {
  if (
    !name.value.trim() ||
    !email.value.trim() ||
    !password.value
  ) {
    return
  }

  try {
    await authStore.register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
    })

    router.push('/auth/login')
  } catch (error) {
    console.error(error)
  }
}
</script>