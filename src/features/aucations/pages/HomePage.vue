<template>
  <section>
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p class="text-sm font-semibold text-indigo-600">Delcom Auction</p>
        <h1 class="text-3xl font-bold text-slate-900">Daftar Lelang</h1>
        <p class="mt-1 text-slate-500">Temukan barang yang sedang dilelang.</p>
      </div>

      <button
        class="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        @click="showAdd = true"
      >
        + Tambah Lelang
      </button>
    </div>

    <div class="mt-6 grid gap-3 md:grid-cols-3">
      <button
        class="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100"
        :class="{ 'ring-2 ring-indigo-500': filter === 'all' }"
        @click="setFilter('all')"
      >
        <p class="text-sm text-slate-500">Semua</p>
        <p class="mt-1 text-2xl font-bold">{{ store.aucations.length }}</p>
      </button>

      <button
        class="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100"
        :class="{ 'ring-2 ring-indigo-500': filter === 'open' }"
        @click="setFilter('open')"
      >
        <p class="text-sm text-slate-500">Sedang Berjalan</p>
        <p class="mt-1 text-2xl font-bold">Lelang</p>
      </button>

      <button
        class="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-100"
        :class="{ 'ring-2 ring-indigo-500': filter === 'closed' }"
        @click="setFilter('closed')"
      >
        <p class="text-sm text-slate-500">Ditutup</p>
        <p class="mt-1 text-2xl font-bold">Lelang</p>
      </button>
    </div>

    <div class="mt-6">
      <div v-if="store.loading" class="rounded-2xl bg-white p-8 text-center shadow-sm">
        Memuat data lelang...
      </div>

      <div v-else-if="store.error" class="rounded-2xl bg-white p-8 text-center text-red-600 shadow-sm">
        {{ store.error }}
      </div>

      <div v-else-if="store.aucations.length === 0" class="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
        Belum ada lelang.
      </div>

      <div v-else class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <RouterLink
          v-for="item in store.aucations"
          :key="item.id"
          :to="`/aucations/${item.id}`"
          class="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="aspect-video bg-slate-100">
            <img
              v-if="item.cover"
              :src="item.cover"
              :alt="item.title"
              class="h-full w-full object-cover"
            />
          </div>

          <div class="p-5">
            <h2 class="line-clamp-2 font-bold text-slate-900">{{ item.title }}</h2>
            <p class="mt-2 text-sm text-slate-500">
              Harga awal
            </p>
            <p class="mt-1 text-lg font-bold text-indigo-600">
              {{ formatRupiah(item.start_bid) }}
            </p>
            <p class="mt-3 text-xs text-slate-400">
              Berakhir: {{ formatDate(item.closed_at) }}
            </p>
          </div>
        </RouterLink>
      </div>
    </div>

    <AddModal
      :open="showAdd"
      :loading="store.status.adding"
      @close="showAdd = false"
      @submit="add"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAucationsStore } from '../states/aucationsStore'
import AddModal from '../modals/AddModal.vue'
import { formatDate, formatRupiah, showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper'

const store = useAucationsStore()
const showAdd = ref(false)
const filter = ref('all')

async function load() {
  const query = {}

  if (filter.value === 'open') query.is_closed = 0
  if (filter.value === 'closed') query.is_closed = 1

  try {
    await store.fetchAucations(query)
  } catch {
    // Store already exposes the error.
  }
}

function setFilter(value) {
  filter.value = value
  load()
}

async function add(payload) {
  try {
    await store.addAucation(payload)
    showAdd.value = false
    await showSuccessDialog('Berhasil', 'Lelang berhasil ditambahkan.')
    await load()
  } catch (error) {
    await showErrorDialog('Gagal', error.message)
  }
}

onMounted(load)
</script>
