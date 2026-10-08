import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/vue'
import { Editor } from '@toast-ui/editor'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'

// SweetAlert2 dimock: otomatis "dikonfirmasi"
vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}))

// Toast UI Editor/Viewer dimock agar tidak membutuhkan DOM penuh
vi.mock('@toast-ui/editor', () => {
  class Editor {
    static instances = []
    constructor(options) {
      this.options = options
      this.markdown = options.initialValue
      this.destroy = vi.fn()
      Editor.instances.push(this)
    }
    getMarkdown() {
      return this.markdown
    }
    setMarkdown(value) {
      this.markdown = value
    }
  }
  return { Editor }
})

vi.mock('@toast-ui/editor/dist/toastui-editor-viewer', () => {
  class Viewer {
    static instances = []
    constructor(options) {
      this.options = options
      this.markdown = options.initialValue
      this.destroy = vi.fn()
      this.setMarkdown = vi.fn((value) => {
        this.markdown = value
      })
      Viewer.instances.push(this)
    }
  }
  return { default: Viewer }
})

URL.createObjectURL = vi.fn(() => 'blob:preview')

afterEach(() => {
  cleanup()
  localStorage.clear()
  Editor.instances.length = 0
  Viewer.instances.length = 0
  vi.clearAllMocks()
  vi.useRealTimers()
})
