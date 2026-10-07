import { computed, ref } from 'vue'

export function useInput(initialValue = '') {
  const value = ref(initialValue)

  const model = computed({
    get: () => value.value,
    set: (newValue) => {
      value.value = newValue
    },
  })

  function reset() {
    value.value = initialValue
  }

  return {
    value,
    model,
    reset,
  }
}
