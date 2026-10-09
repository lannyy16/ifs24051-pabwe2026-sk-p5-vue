```vue
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Clock, Gavel, Plus, Search, Trash2 } from 'lucide-vue-next'
import AddModal from '../components/modals/AddModal.vue'
import BidModal from '../components/modals/BidModal.vue'
import { useNow } from '../../../hooks/useNow'
import { useAucationsStore } from '../states/aucationsStore'
import { useUsersStore } from '../../users/states/usersStore'
import { isSuccess } from '../../../helpers/apiHelper'
import {
  extractErrorMessage,
  formatRupiah,
  getHighestBid,
  getTimeLeft,
  isClosed,
  resolveImageUrl,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from '../../../helpers/toolsHelper'

const TABS = [
  { key: 'all', label: 'Semua Lelang', params: {} },
  { key: 'mine', label: 'Lelang Saya', params: { is_me: 1 } },
  { key: 'open', label: 'Lelang Berlangsung', params: { is_closed: 1 } },
  { key: 'closed', label: 'Lelang Ditutup', params: { is_closed: 0 } },
]

const route = useRoute()
const router = useRouter()
const store = useAucationsStore()
const usersStore = useUsersStore()
const now = useNow()

const search = ref('')
const showAdd = ref(false)
const bidTarget = ref(null)

const activeTab = computed(
  () => TABS.find((tab) => tab.key === route.query.tab) ?? TABS[0],
)

// Gunakan closed_at sebagai sumber status yang konsisten dengan kartu lelang.
const filtered = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return store.aucations.filter((item) => {
    const closed = isClosed(item.closed_at, now.value ?? now)

    // Filter status berdasarkan tab yang dipilih.
    if (activeTab.value.key === 'open' && closed) return false
    if (activeTab.value.key === 'closed' && !closed) return false

    // Filter pencarian berdasarkan judul dan deskripsi.
    const title = item.title ?? ''
    const description = item.description ?? ''
    const matchesSearch = `${title} ${description}`
      .toLowerCase()
      .includes(keyword)

    return matchesSearch
  })
})

const load = () => store.fetchAucations(activeTab.value.params)

watch(() => activeTab.value.key, load, { immediate: true })

// Membuka modal tambah lelang dari menu cepat navbar.
watch(
  () => route.query.add,
  (value) => {
    if (value === '1') {
      showAdd.value = true
      router.replace({ query: { ...route.query, add: undefined } })
    }
  },
  { immediate: true },
)

const selectTab = (key) => {
  router.replace({ query: key === 'all' ? {} : { tab: key } })
}

const isOwner = (item) => item.user_id === usersStore.profile?.id

async function removeAucation(item) {
  if (
    !(await showConfirmDialog(
      `Lelang "${item.title}" akan dihapus permanen.`,
    ))
  ) {
    return
  }

  const response = await store.deleteAucation(item.id)

  if (isSuccess(response)) {
    await showSuccessDialog(response.message)
    load()
  } else {
    showErrorDialog(extractErrorMessage(response))
  }
}

async function removeAll() {
  if (
    !(await showConfirmDialog(
      'Semua lelang milikmu beserta cover dan tawarannya akan dihapus permanen.',
    ))
  ) {
    return
  }

  const response = await store.deleteAllAucations()

  if (isSuccess(response)) {
    await showSuccessDialog(response.message)
    load()
  } else {
    showErrorDialog(extractErrorMessage(response))
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">
          Dashboard Lelang
        </h1>
        <p class="mt-1 text-sm text-muted">
          Temukan barang incaranmu atau pasang barang untuk dilelang.
        </p>
      </div>

      <button
        type="button"
        class="btn btn-brass"
        @click="showAdd = true"
      >
        <Plus :size="16" />
        Pasang lelang
      </button>
    </div>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap gap-2" role="tablist">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          type="button"
          role="tab"
          :aria-selected="tab.key === activeTab.key"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="
            tab.key === activeTab.key
              ? 'bg-pine-800 text-white'
              : 'bg-white text-ink ring-1 ring-line hover:bg-pine-100'
          "
          @click="selectTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="relative w-full sm:w-72">
        <Search
          :size="16"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          v-model="search"
          type="search"
          class="field !pl-9"
          placeholder="Cari judul atau deskripsi…"
          aria-label="Cari lelang"
        />
      </div>
    </div>

    <div
      v-if="activeTab.key === 'mine' && store.aucations.length > 0"
      class="mt-4 flex justify-end"
    >
      <button
        type="button"
        class="btn btn-danger"
        @click="removeAll"
      >
        <Trash2 :size="16" />
        Hapus semua lelang saya
      </button>
    </div>

    <p
      v-if="store.isAucation"
      class="mt-10 text-center text-sm text-muted"
    >
      Memuat lelang…
    </p>

    <div
      v-else-if="filtered.length === 0"
      class="panel mt-8 p-10 text-center"
    >
      <Gavel :size="32" class="mx-auto text-brass-500" />
      <p class="mt-3 font-bold">
        Belum ada lelang yang cocok
      </p>
      <p class="mt-1 text-sm text-muted">
        Coba ganti filter atau kata kunci pencarian.
      </p>
    </div>

    <ul
      v-else
      class="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      <li
        v-for="item in filtered"
        :key="item.id"
        class="panel flex flex-col overflow-hidden"
        data-testid="aucation-card"
      >
        <RouterLink
          :to="`/aucations/${item.id}`"
          :aria-label="`Lihat lelang ${item.title}`"
          class="block aspect-[4/3] bg-pine-100"
        >
          <img
            v-if="item.cover"
            :src="resolveImageUrl(item.cover)"
            :alt="item.title"
            class="size-full object-cover"
          />
          <span
            v-else
            class="grid size-full place-items-center text-pine-700"
          >
            <Gavel :size="40" />
          </span>
        </RouterLink>

        <div class="flex flex-1 flex-col p-4">
          <div
            class="flex items-center justify-between gap-2 text-xs font-semibold"
          >
            <span
              class="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
              :class="
                isClosed(item.closed_at, now.value ?? now)
                  ? 'bg-danger-100 text-danger'
                  : 'bg-pine-100 text-pine-800'
              "
            >
              <Clock :size="12" />
              {{
                isClosed(item.closed_at, now.value ?? now)
                  ? 'Ditutup'
                  : `Sisa ${getTimeLeft(item.closed_at, now.value ?? now)}`
              }}
            </span>

            <span class="text-muted">
              {{ item.bids?.length ?? 0 }} tawaran
            </span>
          </div>

          <RouterLink
            :to="`/aucations/${item.id}`"
            class="mt-3 line-clamp-2 text-lg font-extrabold leading-snug hover:text-pine-700"
          >
            {{ item.title }}
          </RouterLink>

          <p class="mt-1 text-xs text-muted">
            oleh {{ item.author?.name ?? 'Pengguna' }}
          </p>

          <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt class="text-xs text-muted">Harga awal</dt>
              <dd class="font-bold">
                {{ formatRupiah(item.start_bid) }}
              </dd>
            </div>

            <div>
              <dt class="text-xs text-muted">Tawaran tertinggi</dt>
              <dd class="font-extrabold text-brass-600">
                {{ formatRupiah(getHighestBid(item)) }}
              </dd>
            </div>
          </dl>

          <div class="mt-5 flex gap-2">
            <RouterLink
              :to="`/aucations/${item.id}`"
              class="btn btn-ghost flex-1"
            >
              Lihat detail
            </RouterLink>

            <button
              v-if="isOwner(item)"
              type="button"
              class="btn btn-danger"
              aria-label="Hapus lelang"
              @click="removeAucation(item)"
            >
              <Trash2 :size="16" />
            </button>

            <button
              v-else-if="!isClosed(item.closed_at, now.value ?? now)"
              type="button"
              class="btn btn-brass"
              @click="bidTarget = item"
            >
              Tawar
            </button>
          </div>
        </div>
      </li>
    </ul>

    <AddModal
      :open="showAdd"
      @close="showAdd = false"
      @saved="load"
    />

    <BidModal
      v-if="bidTarget"
      :open="true"
      :aucation="bidTarget"
      @close="bidTarget = null"
      @saved="load"
    />
  </div>
</template>
```