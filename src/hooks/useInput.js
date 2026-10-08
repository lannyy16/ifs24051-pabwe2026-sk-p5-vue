import { ref } from 'vue'

/**
 * Composable input form.
 * const [email, onEmailChange, resetEmail] = useInput('')
 * - `email` adalah ref yang bisa dipakai pada v-model
 * - `onChange` menerima Event (input) ataupun nilai langsung
 */
export function useInput(defaultValue = '') {
  const value = ref(defaultValue)
  const onChange = (eventOrValue) => {
    value.value = eventOrValue?.target ? eventOrValue.target.value : eventOrValue
  }
  const reset = () => {
    value.value = defaultValue
  }
  return [value, onChange, reset]
}

export default useInput
