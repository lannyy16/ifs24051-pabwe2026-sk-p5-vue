<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Clock, Gavel, ImagePlus, Pencil, Trash2 } from 'lucide-vue-next'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import ChangeModal from '../components/modals/ChangeModal.vue'
import ChangeCoverModal from '../components/modals/ChangeCoverModal.vue'
import BidModal from '../components/modals/BidModal.vue'
import { useNow } from '../../../hooks/useNow'
import { useAucationsStore } from '../states/aucationsStore'
import { useUsersStore } from '../../users/states/usersStore'
import { isSuccess } from '../../../helpers/apiHelper'
import {
  extractErrorMessage,
  formatDate,
  formatRupiah,
  getHighestBid,
  getTimeLeft,
  isClosed,
  resolveImageUrl,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const route = useRoute()
const router = useRouter()
const store = useAucationsStore()
const usersStore = useUsersStore()
const now = useNow()

const showChange = ref(false)
const showCover = ref(false)
const showBid = ref(false)

const aucation = computed(() => store.aucation)
const closed = computed(() => isClosed(aucation.value.closed_at, now.value))
const isOwner = computed(() => aucation.value.user_id === usersStore.profile?.id)
const bidHistory = computed(() => [...aucation.value.bids].sort((a, b) => b.bid - a.bid))

function load() {
  store.aucation = null
  return store.fetchAucation(route.params.aucationId)
}
watch(() => route.params.aucationId, load, { immediate: true })

async function run(action, message, onDone) {
  if (!(await showConfirmDialog(message))) return
  const response = await action()
  if (isSuccess(response)) {
    await showSuccessDialog(response.message)
    onDone()
  } else {
    showErrorDialog(extractErrorMessage(response))
  }
}

const removeAucation = () =>
  run(() => store.deleteAucation(aucation.value.id), 'Lelang ini akan dihapus permanen.', () => router.push('/'))

const cancelBid = () =>
  run(() => store.deleteBid(aucation.value.id), 'Tawaranmu pada lelang ini akan dibatalkan.', load)
</script>

<template>
  <div>
    <RouterLink to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-pine-700 hover:underline">
      <ArrowLeft :size="16" /> Kembali ke dashboard
    </RouterLink>

    <p v-if="store.isAucation" class="mt-10 text-center text-sm text-muted">Memuat detail lelang…</p>
    <div v-else-if="!aucation" class="panel mt-8 p-10 text-center">
      <p class="font-bold">Lelang tidak ditemukan</p>
      <p class="mt-1 text-sm text-muted">Lelang mungkin sudah dihapus oleh pemiliknya.</p>
    </div>

    <div v-else class="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div class="aspect-[4/3] overflow-hidden rounded-xl border border-line bg-pine-100">
          <img v-if="aucation.cover" :src="resolveImageUrl(aucation.cover)" :alt="aucation.title" class="size-full object-cover" />
          <span v-else class="grid size-full place-items-center text-pine-700"><Gavel :size="56" /></span>
        </div>
        <section class="panel mt-6 p-5">
          <h2 class="mb-3 text-lg font-extrabold">Deskripsi barang</h2>
          <MarkdownViewer :content="aucation.description" />
        </section>
      </div>

      <div class="space-y-6">
        <section class="panel p-6">
          <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" :class="closed ? 'bg-danger-100 text-danger' : 'bg-pine-100 text-pine-800'">
            <Clock :size="12" />
            {{ closed ? 'Lelang ditutup' : `Sisa ${getTimeLeft(aucation.closed_at, now)}` }}
          </span>
          <h1 class="mt-3 text-3xl/tight font-extrabold tracking-tight">{{ aucation.title }}</h1>
          <p class="mt-2 text-sm text-muted">oleh {{ aucation.author.name }} · ditutup {{ formatDate(aucation.closed_at) }}</p>

          <dl class="mt-6 grid grid-cols-2 gap-4">
            <div>
              <dt class="text-xs text-muted">Harga awal</dt>
              <dd class="text-lg font-bold">{{ formatRupiah(aucation.start_bid) }}</dd>
            </div>
            <div>
              <dt class="text-xs text-muted">Tawaran tertinggi</dt>
              <dd class="text-2xl font-extrabold text-brass-600">{{ formatRupiah(getHighestBid(aucation)) }}</dd>
            </div>
          </dl>

          <div v-if="isOwner" class="mt-6 flex flex-wrap gap-2">
            <button type="button" class="btn btn-ghost" @click="showChange = true"><Pencil :size="16" /> Ubah</button>
            <button type="button" class="btn btn-ghost" @click="showCover = true"><ImagePlus :size="16" /> Ganti cover</button>
            <button type="button" class="btn btn-danger" @click="removeAucation"><Trash2 :size="16" /> Hapus</button>
          </div>
          <div v-else-if="!closed" class="mt-6 space-y-3">
            <p v-if="aucation.my_bid" class="rounded-lg bg-brass-100 px-4 py-3 text-sm">
              Tawaranmu: <strong>{{ formatRupiah(aucation.my_bid.bid) }}</strong>
            </p>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn btn-brass" @click="showBid = true">Ajukan tawaran</button>
              <button v-if="aucation.my_bid" type="button" class="btn btn-danger" @click="cancelBid">Batalkan tawaran</button>
            </div>
          </div>
        </section>

        <section class="panel p-6">
          <h2 class="text-lg font-extrabold">Riwayat tawaran</h2>
          <p v-if="bidHistory.length === 0" class="mt-3 text-sm text-muted">Belum ada tawaran. Jadilah yang pertama.</p>
          <ol v-else class="mt-4 divide-y divide-line">
            <li v-for="bid in bidHistory" :key="bid.id" class="flex items-center justify-between py-3 text-sm">
              <span class="font-bold">{{ formatRupiah(bid.bid) }}</span>
              <span class="text-muted">
                {{ formatDate(bid.created_at) }}
                <strong v-if="aucation.my_bid?.id === bid.id" class="ml-2 text-pine-700">tawaranmu</strong>
              </span>
            </li>
          </ol>
        </section>
      </div>

      <ChangeModal :open="showChange" :aucation="aucation" @close="showChange = false" @saved="load" />
      <ChangeCoverModal :open="showCover" :aucation="aucation" @close="showCover = false" @saved="load" />
      <BidModal :open="showBid" :aucation="aucation" @close="showBid = false" @saved="load" />
    </div>
  </div>
</template>
