<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Editor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

const props = defineProps({
  modelValue: { type: String, default: '' },
  height: { type: String, default: '260px' },
  placeholder: { type: String, default: 'Tulis deskripsi barang dengan Markdown…' },
})
const emit = defineEmits(['update:modelValue'])

const target = ref(null)
let editor = null

onMounted(() => {
  editor = new Editor({
    el: target.value,
    initialValue: props.modelValue,
    initialEditType: 'markdown',
    previewStyle: 'tab',
    height: props.height,
    placeholder: props.placeholder,
    usageStatistics: false,
    events: { change: () => emit('update:modelValue', editor.getMarkdown()) },
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (value !== editor.getMarkdown()) editor.setMarkdown(value)
  },
)

onBeforeUnmount(() => editor.destroy())
</script>

<template>
  <div ref="target" data-testid="markdown-editor" />
</template>
