<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-50 p-6">
    <div class="text-center">
      <p class="text-7xl font-black text-indigo-600">404</p>
      <h1 class="mt-4 text-2xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
      <p class="mt-2 text-slate-500">Halaman yang kamu cari tidak tersedia.</p>
      <RouterLink
        to="/"
        class="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
      >
        Kembali ke Beranda
      </RouterLink>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
