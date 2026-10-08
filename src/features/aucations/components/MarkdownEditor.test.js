import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import MarkdownEditor from './MarkdownEditor.vue'

describe('MarkdownEditor', () => {
  it('menampilkan label ketika label diberikan', () => {
    const wrapper = mount(
      MarkdownEditor,
      {
        props: {
          label: 'Deskripsi',
        },
      },
    )

    expect(
      wrapper.find('label').exists(),
    ).toBe(true)

    expect(
      wrapper.find('label').text(),
    ).toBe('Deskripsi')
  })

  it('tidak menampilkan label ketika label kosong', () => {
    const wrapper = mount(
      MarkdownEditor,
    )

    expect(
      wrapper.find('label').exists(),
    ).toBe(false)
  })

  it('menggunakan modelValue sebagai value textarea', () => {
    const wrapper = mount(
      MarkdownEditor,
      {
        props: {
          modelValue: 'Isi deskripsi',
        },
      },
    )

    expect(
      wrapper.find('textarea').element.value,
    ).toBe('Isi deskripsi')
  })

  it('menggunakan modelValue kosong secara default', () => {
    const wrapper = mount(
      MarkdownEditor,
    )

    expect(
      wrapper.find('textarea').element.value,
    ).toBe('')
  })

  it('mengirim event update:modelValue ketika textarea berubah', async () => {
    const wrapper = mount(
      MarkdownEditor,
      {
        props: {
          modelValue: '',
        },
      },
    )

    const textarea =
      wrapper.find('textarea')

    await textarea.setValue(
      'Deskripsi baru',
    )

    expect(
      wrapper.emitted('update:modelValue'),
    ).toBeTruthy()

    expect(
      wrapper.emitted(
        'update:modelValue',
      )[0],
    ).toEqual([
      'Deskripsi baru',
    ])
  })

  it('memiliki textarea sebagai elemen utama editor', () => {
    const wrapper = mount(
      MarkdownEditor,
    )

    expect(
      wrapper.find('textarea').exists(),
    ).toBe(true)
  })
})