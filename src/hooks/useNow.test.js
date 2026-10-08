import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { render } from '@testing-library/vue'
import { useNow } from './useNow'

describe('useNow', () => {
  it('memperbarui waktu berkala dan membersihkan timer saat unmount', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00'))
    let now
    const Comp = defineComponent({
      setup() {
        now = useNow()
        return () => h('div')
      },
    })
    const { unmount } = render(Comp)
    const first = now.value.getTime()
    vi.advanceTimersByTime(30000)
    expect(now.value.getTime()).toBeGreaterThan(first)

    const clear = vi.spyOn(globalThis, 'clearInterval')
    unmount()
    expect(clear).toHaveBeenCalled()
  })
})
