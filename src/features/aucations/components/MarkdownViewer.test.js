import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import MarkdownViewer from './MarkdownViewer.vue'

describe('MarkdownViewer', () => {
  it('merender konten awal (default kosong)', () => {
    render(MarkdownViewer)
    expect(screen.getByTestId('markdown-viewer')).toBeInTheDocument()
    expect(Viewer.instances[0].options.initialValue).toBe('')
  })

  it('memperbarui konten saat prop berubah dan menghancurkan viewer saat unmount', async () => {
    const { rerender, unmount } = render(MarkdownViewer, { props: { content: '# Judul' } })
    const [viewer] = Viewer.instances
    expect(viewer.options.initialValue).toBe('# Judul')
    await rerender({ content: 'baru' })
    expect(viewer.setMarkdown).toHaveBeenCalledWith('baru')
    unmount()
    expect(viewer.destroy).toHaveBeenCalled()
  })
})
