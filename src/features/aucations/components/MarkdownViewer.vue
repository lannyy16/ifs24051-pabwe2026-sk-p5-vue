<template>
  <div class="whitespace-pre-wrap leading-7 text-slate-600">
    {{ content || 'Tidak ada deskripsi.' }}
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    default: '',
  },
})
</script>
