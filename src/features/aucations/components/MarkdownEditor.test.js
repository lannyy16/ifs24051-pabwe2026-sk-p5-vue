import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { Editor } from '@toast-ui/editor'
import MarkdownEditor from './MarkdownEditor.vue'

describe('MarkdownEditor', () => {
  it('membuat editor dengan nilai awal dan opsi default', () => {
    render(MarkdownEditor)
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument()
    const [editor] = Editor.instances
    expect(editor.options).toMatchObject({
      initialValue: '',
      initialEditType: 'markdown',
      height: '260px',
      usageStatistics: false,
    })
    expect(editor.options.placeholder).toMatch(/Markdown/)
  })

  it('meneruskan props kustom', () => {
    render(MarkdownEditor, { props: { modelValue: '# Halo', height: '100px', placeholder: 'Isi' } })
    expect(Editor.instances[0].options).toMatchObject({ initialValue: '# Halo', height: '100px', placeholder: 'Isi' })
  })

  it('emit update:modelValue saat konten berubah', () => {
    const { emitted } = render(MarkdownEditor, { props: { modelValue: '' } })
    const [editor] = Editor.instances
    editor.markdown = 'konten baru'
    editor.options.events.change()
    expect(emitted()['update:modelValue'][0]).toEqual(['konten baru'])
  })

  it('menyinkronkan perubahan prop dari luar, tanpa memanggil setMarkdown jika sama', async () => {
    const { rerender } = render(MarkdownEditor, { props: { modelValue: 'a' } })
    const [editor] = Editor.instances
    editor.setMarkdown = vi.fn(editor.setMarkdown)
    await rerender({ modelValue: 'b' })
    expect(editor.setMarkdown).toHaveBeenCalledWith('b')
    editor.markdown = 'c'
    await rerender({ modelValue: 'c' })
    expect(editor.setMarkdown).toHaveBeenCalledTimes(1)
  })

  it('menghancurkan editor saat unmount', () => {
    const { unmount } = render(MarkdownEditor)
    const [editor] = Editor.instances
    unmount()
    expect(editor.destroy).toHaveBeenCalled()
  })
})
