<script setup>
import { Gavel } from 'lucide-vue-next'
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
    <aside
      class="relative hidden flex-col justify-between overflow-hidden bg-pine-950 p-12 text-white lg:flex"
      data-testid="auth-banner"
    >
      <div class="flex items-center gap-3">
        <span class="grid size-11 place-items-center rounded-xl bg-brass-500 text-pine-950">
          <Gavel :size="22" />
        </span>
        <span class="text-lg font-extrabold tracking-tight">Delcom Auction</span>
      </div>
      <div class="max-w-md">
        <h1 class="text-4xl/tight font-extrabold tracking-tight">
          Satu ketukan palu, satu barang menemukan pemilik barunya.
        </h1>
        <p class="mt-5 text-base/7 text-pine-100">
          Pasang barangmu, pantau tawaran yang masuk, dan menangkan lelang sebelum waktu habis.
        </p>
      </div>
      <p class="text-sm text-pine-100/70">Praktikum PABWE 2026 · Delcom Open API</p>
    </aside>

    <main class="flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md">
        <div class="mb-8 flex items-center gap-3 lg:hidden">
          <span class="grid size-10 place-items-center rounded-xl bg-pine-800 text-brass-500">
            <Gavel :size="20" />
          </span>
          <span class="text-lg font-extrabold">Delcom Auction</span>
        </div>
        <RouterView />
      </div>
    </main>
  </div>
</template>
