<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-semibold text-slate-700">
      {{ label }}
    </label>
    <textarea
      :value="modelValue"
      class="min-h-40 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-indigo-500"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>
