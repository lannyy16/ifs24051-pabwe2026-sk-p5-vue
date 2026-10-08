<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, LogOut, Menu, Plus, UserRound } from 'lucide-vue-next'
import { useAuthStore } from '../../auth/states/authStore'
import { useUsersStore } from '../../users/states/usersStore'
import { getInitials, resolveImageUrl, showConfirmDialog } from '../../../helpers/toolsHelper'

const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const menuOpen = ref(false)

async function onLogout() {
  menuOpen.value = false
  if (await showConfirmDialog('Kamu akan keluar dari akun ini.', 'Keluar?')) {
    await authStore.logout()
    router.push('/auth/login')
  }
}
</script>

<template>
  <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur sm:px-8">
    <button type="button" class="btn btn-ghost !p-2 lg:hidden" aria-label="Buka menu" @click="emit('toggle-sidebar')">
      <Menu :size="20" />
    </button>
    <div class="hidden lg:block" />

    <div class="flex items-center gap-2">
      <div class="relative">
        <button type="button" class="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-pine-100" :aria-expanded="menuOpen" aria-label="Menu akun" @click="menuOpen = !menuOpen">
          <img v-if="usersStore.profile?.photo" :src="resolveImageUrl(usersStore.profile.photo)" alt="Foto profil" class="size-8 rounded-full object-cover" />
          <span v-else class="grid size-8 place-items-center rounded-full bg-pine-800 text-xs font-bold text-white">
            {{ getInitials(usersStore.profile?.name) }}
          </span>
          <span class="hidden text-sm font-semibold sm:block">{{ usersStore.profile?.name ?? 'Pengguna' }}</span>
          <ChevronDown :size="16" />
        </button>

        <div v-if="menuOpen" class="panel absolute right-0 mt-2 w-52 p-1.5 shadow-lg" role="menu">
          <RouterLink to="/profile" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-pine-100" role="menuitem" @click="menuOpen = false">
            <UserRound :size="16" /> Profil Saya
          </RouterLink>
          <RouterLink :to="{ path: '/', query: { add: '1' } }" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-pine-100" role="menuitem" @click="menuOpen = false">
            <Plus :size="16" /> Pasang lelang
          </RouterLink>
        </div>
      </div>

      <button type="button" class="btn btn-ghost" @click="onLogout"><LogOut :size="16" /> Keluar</button>
    </div>
  </header>
</template>
