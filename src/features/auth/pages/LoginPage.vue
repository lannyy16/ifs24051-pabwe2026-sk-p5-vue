<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="grid min-h-screen md:grid-cols-2">

      <!-- Left -->
      <div
        class="hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-10 text-white md:flex md:flex-col md:justify-between lg:p-12"
      >
        <div>
          <div class="mb-12 flex items-center gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur"
            >
              DA
            </div>

            <div>
              <h1 class="text-xl font-bold">
                Delcom Auction
              </h1>

              <p class="text-sm text-indigo-200">
                Platform Lelang
              </p>
            </div>
          </div>

          <div class="max-w-lg">
            <p
              class="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-indigo-100"
            >
              Selamat Datang 👋
            </p>

            <h2 class="text-4xl font-bold leading-tight">
              Temukan barang menarik dan ikuti lelang dengan mudah.
            </h2>

            <p class="mt-6 max-w-md text-lg leading-relaxed text-indigo-100">
              Delcom Auction membantu kamu mengikuti proses lelang secara
              sederhana, cepat, dan nyaman.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p class="text-2xl font-bold">24/7</p>
            <p class="mt-1 text-sm text-indigo-100">Akses</p>
          </div>

          <div class="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p class="text-2xl font-bold">Easy</p>
            <p class="mt-1 text-sm text-indigo-100">Digunakan</p>
          </div>

          <div class="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p class="text-2xl font-bold">Fast</p>
            <p class="mt-1 text-sm text-indigo-100">Proses</p>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div class="w-full max-w-md">

          <!-- Mobile Logo -->
          <div class="mb-8 flex items-center justify-center gap-3 md:hidden">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200"
            >
              DA
            </div>

            <div>
              <h1 class="text-xl font-bold text-gray-900">
                Delcom Auction
              </h1>

              <p class="text-sm text-gray-500">
                Platform Lelang
              </p>
            </div>
          </div>

          <!-- Card -->
          <div
            class="rounded-3xl border border-gray-100 bg-white p-7 shadow-xl shadow-gray-200/60 sm:p-9"
          >
            <div class="mb-8">
              <div
                class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl"
              >
                🔐
              </div>

              <h2 class="text-3xl font-bold tracking-tight text-gray-900">
                Masuk
              </h2>

              <p class="mt-2 text-sm leading-6 text-gray-500">
                Masuk ke akun Delcom Auction untuk mulai mengikuti lelang.
              </p>
            </div>

            <!-- Error -->
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
              <!-- Email -->
              <div>
                <label
                  for="email"
                  class="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>

                <div class="relative">
                  <span
                    class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    ✉️
                  </span>

                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    placeholder="Masukkan email"
                    required
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <!-- Password -->
              <div>
                <label
                  for="password"
                  class="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div class="relative">
                  <span
                    class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    🔒
                  </span>

                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    placeholder="Masukkan password"
                    required
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    @click="showPassword = !showPassword"
                  >
                    {{ showPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="authStore.loading"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  v-if="authStore.loading"
                  class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                ></span>

                <span>
                  {{ authStore.loading ? 'Sedang masuk...' : 'Masuk' }}
                </span>
              </button>
            </form>

            <!-- Register -->
            <div class="mt-7 border-t border-gray-100 pt-6 text-center">
              <p class="text-sm text-gray-500">
                Belum punya akun?
                <RouterLink
                  to="/auth/register"
                  class="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
                >
                  Daftar sekarang
                </RouterLink>
              </p>
            </div>
          </div>

          <p class="mt-6 text-center text-xs text-gray-400">
            © 2026 Delcom Auction. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../states/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleSubmit() {
  if (!email.value.trim() || !password.value) {
    return
  }

  try {
    await authStore.login({
      email: email.value.trim(),
      password: password.value,
    })

    router.push('/')
  } catch (error) {
    console.error(error)
  }
}
</script>