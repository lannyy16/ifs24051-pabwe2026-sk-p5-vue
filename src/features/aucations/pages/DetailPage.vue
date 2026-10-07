<template>
  <section>
    <div v-if="store.loading" class="rounded-2xl bg-white p-8 text-center">
      Memuat detail...
    </div>

    <div v-else-if="store.error" class="rounded-2xl bg-white p-8 text-red-600">
      {{ store.error }}
    </div>

    <div v-else-if="!item" class="rounded-2xl bg-white p-8 text-slate-500">
      Data tidak ditemukan.
    </div>

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <RouterLink
          to="/"
          class="font-semibold text-indigo-600"
        >
          ← Kembali
        </RouterLink>

        <div class="flex gap-2">
          <button
            class="rounded-xl border border-slate-200 px-4 py-2 font-semibold"
            @click="showChange = true"
          >
            Ubah
          </button>
          <button
            class="rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-600"
            @click="remove"
          >
            Hapus
          </button>
        </div>
      </div>

      <article class="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
        <div class="aspect-[16/7] bg-slate-100">
          <img
            v-if="item.cover"
            :src="item.cover"
            :alt="item.title"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="p-6 md:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <span class="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
              Lelang
            </span>
            <span class="text-sm text-slate-500">
              Berakhir {{ formatDate(item.closed_at) }}
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-bold text-slate-900">{{ item.title }}</h1>

          <div class="mt-5">
            <p class="text-sm text-slate-500">Harga awal</p>
            <p class="text-2xl font-bold text-indigo-600">
              {{ formatRupiah(item.start_bid) }}
            </p>
          </div>

          <div class="mt-8 border-t border-slate-100 pt-6">
            <h2 class="text-lg font-bold">Deskripsi</h2>
            <div class="mt-3">
              <MarkdownViewer :content="item.description" />
            </div>
          </div>

          <div class="mt-8">
            <button
              class="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
              @click="showBid = true"
            >
              Ajukan Bid
            </button>
          </div>
        </div>
      </article>

      <ChangeModal
        :open="showChange"
        :aucation="item"
        :loading="store.status.updating"
        @close="showChange = false"
        @submit="change"
      />

      <BidModal
        :open="showBid"
        :loading="store.status.bidding"
        @close="showBid = false"
        @submit="bid"
      />

      <ChangeCoverModal
        :open="showCover"
        :loading="store.status.changingCover"
        @close="showCover = false"
        @submit="changeCover"
      />
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAucationsStore } from '../states/aucationsStore'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import ChangeModal from '../modals/ChangeModal.vue'
import BidModal from '../modals/BidModal.vue'
import ChangeCoverModal from '../modals/ChangeCoverModal.vue'
import {
  formatDate,
  formatRupiah,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const route = useRoute()
const router = useRouter()
const store = useAucationsStore()

const showChange = ref(false)
const showBid = ref(false)
const showCover = ref(false)

const item = computed(() => store.currentAucation)

async function load() {
  try {
    await store.fetchAucation(route.params.aucationId)
  } catch {
    // Store already exposes the error.
  }
}

async function change(payload) {
  try {
    await store.updateAucation(route.params.aucationId, payload)
    showChange.value = false
    await showSuccessDialog('Berhasil', 'Data lelang diperbarui.')
    await load()
  } catch (error) {
    await showErrorDialog('Gagal', error.message)
  }
}

async function bid(value) {
  try {
    await store.addBid(route.params.aucationId, value)
    showBid.value = false
    await showSuccessDialog('Berhasil', 'Bid berhasil dikirim.')
    await load()
  } catch (error) {
    await showErrorDialog('Gagal', error.message)
  }
}

async function changeCover(file) {
  try {
    await store.changeCover(route.params.aucationId, file)
    showCover.value = false
    await showSuccessDialog('Berhasil', 'Cover berhasil diperbarui.')
    await load()
  } catch (error) {
    await showErrorDialog('Gagal', error.message)
  }
}

async function remove() {
  const result = await showConfirmDialog(
    'Hapus lelang?',
    'Data yang dihapus tidak dapat dikembalikan.',
  )

  if (!result.isConfirmed) return

  try {
    await store.deleteAucation(route.params.aucationId)
    await showSuccessDialog('Berhasil', 'Lelang berhasil dihapus.')
    await router.push('/')
  } catch (error) {
    await showErrorDialog('Gagal', error.message)
  }
}

onMounted(load)
</script>
