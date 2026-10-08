import { onBeforeUnmount, onMounted, ref } from 'vue'

const INTERVAL_MS = 30000

/** Ref waktu sekarang yang diperbarui berkala (untuk countdown lelang). */
export function useNow() {
  const now = ref(new Date())
  let timer = null
  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date()
    }, INTERVAL_MS)
  })
  onBeforeUnmount(() => clearInterval(timer))
  return now
}
