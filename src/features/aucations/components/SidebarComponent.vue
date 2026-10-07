<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 mt-16 w-64 transform border-r border-slate-200 bg-white p-4 transition-transform md:static md:mt-0 md:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <nav class="space-y-2">
      <RouterLink
        to="/"
        class="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
        @click="$emit('close')"
      >
        🏠 Dashboard
      </RouterLink>

      <RouterLink
        to="/users"
        class="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
        @click="$emit('close')"
      >
        👥 Pengguna
      </RouterLink>

      <RouterLink
        to="/profile"
        class="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
        @click="$emit('close')"
      >
        👤 Profil
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])
</script>
