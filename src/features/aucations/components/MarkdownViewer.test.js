import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import MarkdownViewer from './MarkdownViewer.vue'

describe('MarkdownViewer', () => {
  it('menampilkan content ketika content diberikan', () => {
    const wrapper = mount(
      MarkdownViewer,
      {
        props: {
          content: 'Ini adalah deskripsi lelang.',
        },
      },
    )

    expect(
      wrapper.text(),
    ).toBe(
      'Ini adalah deskripsi lelang.',
    )
  })

  it('menampilkan pesan default ketika content kosong', () => {
    const wrapper = mount(
      MarkdownViewer,
      {
        props: {
          content: '',
        },
      },
    )

    expect(
      wrapper.text(),
    ).toBe(
      'Tidak ada deskripsi.',
    )
  })

  it('menggunakan content kosong secara default', () => {
    const wrapper = mount(
      MarkdownViewer,
    )

    expect(
      wrapper.text(),
    ).toBe(
      'Tidak ada deskripsi.',
    )
  })

  it('menampilkan content dengan whitespace dan newline', () => {
    const content =
      'Baris pertama\nBaris kedua'

    const wrapper = mount(
      MarkdownViewer,
      {
        props: {
          content,
        },
      },
    )

    expect(
      wrapper.text(),
    ).toBe(content)
  })

  it('memiliki class whitespace-pre-wrap', () => {
    const wrapper = mount(
      MarkdownViewer,
    )

    expect(
      wrapper.classes(),
    ).toContain(
      'whitespace-pre-wrap',
    )
  })

  it('memiliki class leading-7', () => {
    const wrapper = mount(
      MarkdownViewer,
    )

    expect(
      wrapper.classes(),
    ).toContain(
      'leading-7',
    )
  })
})