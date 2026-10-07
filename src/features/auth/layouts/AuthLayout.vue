<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-white text-2xl font-bold shadow-lg">
          DA
        </div>
        <h1 class="mt-4 text-3xl font-bold text-white">Delcom Auction</h1>
        <p class="mt-2 text-slate-400">Aplikasi lelang sederhana</p>
      </div>

      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
