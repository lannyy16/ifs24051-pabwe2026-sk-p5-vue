<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

const props = defineProps({ content: { type: String, default: '' } })

const target = ref(null)
let viewer = null

onMounted(() => {
  viewer = new Viewer({ el: target.value, initialValue: props.content })
})

watch(
  () => props.content,
  (value) => viewer.setMarkdown(value),
)

onBeforeUnmount(() => viewer.destroy())
</script>

<template>
  <div ref="target" data-testid="markdown-viewer" />
</template>
