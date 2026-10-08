<script setup>
import { useRoute } from 'vue-router'
import { Gavel, LayoutDashboard, Tag, UserRound, Users, X } from 'lucide-vue-next'

defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const route = useRoute()

const items = [
  { label: 'Dashboard Lelang', to: { path: '/' }, tab: '', icon: LayoutDashboard },
  { label: 'Lelang Saya', to: { path: '/', query: { tab: 'mine' } }, tab: 'mine', icon: Tag },
  { label: 'Daftar Pengguna', to: { path: '/users' }, tab: '', icon: Users },
  { label: 'Profil Saya', to: { path: '/profile' }, tab: '', icon: UserRound },
]

const isActive = (item) => route.path === item.to.path && (route.query.tab || '') === item.tab
</script>

<template>
  <div>
    <div v-if="open" class="fixed inset-0 z-30 bg-pine-950/50 lg:hidden" data-testid="sidebar-backdrop" @click="emit('close')" />
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-pine-950 p-5 text-white transition-transform lg:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full'"
      aria-label="Navigasi utama"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="grid size-10 place-items-center rounded-xl bg-brass-500 text-pine-950"><Gavel :size="20" /></span>
          <span class="font-extrabold tracking-tight">Delcom Auction</span>
        </div>
        <button type="button" class="rounded-lg p-1.5 text-pine-100 hover:bg-white/10 lg:hidden" aria-label="Tutup menu" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>

      <nav class="mt-10 space-y-1">
        <RouterLink
          v-for="item in items"
          :key="item.label"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition"
          :class="isActive(item) ? 'bg-white text-pine-950' : 'text-pine-100 hover:bg-white/10'"
          @click="emit('close')"
        >
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
  </div>
</template>
