<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="flex h-16 items-center justify-between px-4 md:px-8">
      <div class="flex items-center gap-3">
        <button
          class="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          @click="$emit('toggle-sidebar')"
        >
          ☰
        </button>

        <RouterLink to="/" class="flex items-center gap-2">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
            DA
          </span>
          <span class="font-bold text-slate-900">Delcom Auction</span>
        </RouterLink>
      </div>

      <button
        class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        @click="logout"
      >
        Keluar
      </button>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../auth/states/authStore'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const auth = useAuthStore()

async function logout() {
  await auth.logout()
  await router.push('/auth/login')
}
</script>
