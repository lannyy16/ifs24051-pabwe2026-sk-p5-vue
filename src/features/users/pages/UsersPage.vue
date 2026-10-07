<template>
  <section>
    <div class="mb-6">
      <p class="text-sm font-semibold text-indigo-600">Pengguna</p>
      <h1 class="text-3xl font-bold text-slate-900">Daftar Pengguna</h1>
    </div>

    <div v-if="store.loading" class="rounded-2xl bg-white p-6 shadow-sm">
      Memuat pengguna...
    </div>

    <div v-else-if="store.error" class="rounded-2xl bg-white p-6 text-red-600 shadow-sm">
      {{ store.error }}
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="user in store.users"
        :key="user.id"
        class="rounded-2xl bg-white p-5 shadow-sm"
      >
        <h2 class="font-bold text-slate-900">{{ user.name || user.username }}</h2>
        <p class="mt-1 text-sm text-slate-500">@{{ user.username }}</p>
      </div>

      <div v-if="store.users.length === 0" class="rounded-2xl bg-white p-6 text-slate-500">
        Belum ada data pengguna.
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '../states/usersStore'

const store = useUsersStore()

onMounted(() => {
  store.fetchUsers().catch(() => {})
})
</script>
