import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import ChangeCoverModal from './ChangeCoverModal.vue'

describe('ChangeCoverModal', () => {
  function mountModal(
    props = {},
  ) {
    return mount(
      ChangeCoverModal,
      {
        props: {
          open: true,
          loading: false,
          ...props,
        },
      },
    )
  }

  it('tidak menampilkan modal ketika open false', () => {
    const wrapper =
      mountModal({
        open: false,
      })

    expect(
      wrapper.find('form').exists(),
    ).toBe(false)
  })

  it('menampilkan modal ketika open true', () => {
    const wrapper =
      mountModal({
        open: true,
      })

    expect(
      wrapper.find('form').exists(),
    ).toBe(true)

    expect(
      wrapper.text(),
    ).toContain(
      'Ganti Cover',
    )
  })

  it('menampilkan input file dengan atribut yang benar', () => {
    const wrapper =
      mountModal()

    const fileInput =
      wrapper.find(
        'input[type="file"]',
      )

    expect(
      fileInput.exists(),
    ).toBe(true)

    expect(
      fileInput.attributes('accept'),
    ).toBe('image/*')

    expect(
      fileInput.attributes('required'),
    ).toBeDefined()
  })

  it('mengirim event close ketika tombol X diklik', async () => {
    const wrapper =
      mountModal()

    const closeButton =
      wrapper.findAll('button')[0]

    await closeButton.trigger(
      'click',
    )

    expect(
      wrapper.emitted('close'),
    ).toHaveLength(1)
  })

  it('mengirim event close ketika tombol Batal diklik', async () => {
    const wrapper =
      mountModal()

    const cancelButton =
      wrapper
        .findAll('button')
        .find(
          (button) =>
            button.text() === 'Batal',
        )

    await cancelButton.trigger(
      'click',
    )

    expect(
      wrapper.emitted('close'),
    ).toHaveLength(1)
  })

  it('menampilkan Upload ketika tidak loading', () => {
    const wrapper =
      mountModal({
        loading: false,
      })

    expect(
      wrapper.text(),
    ).toContain('Upload')

    expect(
      wrapper.text(),
    ).not.toContain(
      'Mengunggah...',
    )
  })

  it('menampilkan Mengunggah ketika loading', () => {
    const wrapper =
      mountModal({
        loading: true,
      })

    expect(
      wrapper.text(),
    ).toContain(
      'Mengunggah...',
    )

    expect(
      wrapper.text(),
    ).not.toContain(
      'Upload',
    )
  })

  it('menyimpan file ketika input file berubah', async () => {
    const wrapper =
      mountModal()

    const file =
      new File(
        ['image content'],
        'cover.jpg',
        {
          type: 'image/jpeg',
        },
      )

    const fileInput =
      wrapper.find(
        'input[type="file"]',
      )

    Object.defineProperty(
      fileInput.element,
      'files',
      {
        value: [file],
        writable: false,
      },
    )

    await fileInput.trigger(
      'change',
    )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      wrapper.emitted('submit'),
    ).toHaveLength(1)

    expect(
      wrapper.emitted('submit')[0][0],
    ).toBe(file)
  })

  it('mengirim file yang dipilih ketika form disubmit', async () => {
    const wrapper =
      mountModal()

    const file =
      new File(
        ['test image'],
        'auction-cover.png',
        {
          type: 'image/png',
        },
      )

    const fileInput =
      wrapper.find(
        'input[type="file"]',
      )

    Object.defineProperty(
      fileInput.element,
      'files',
      {
        value: [file],
        writable: false,
      },
    )

    await fileInput.trigger(
      'change',
    )

    await wrapper
      .find('form')
      .trigger('submit')

    const events =
      wrapper.emitted('submit')

    expect(events).toHaveLength(1)

    expect(
      events[0][0],
    ).toBe(file)

    expect(
      events[0][0].name,
    ).toBe(
      'auction-cover.png',
    )

    expect(
      events[0][0].type,
    ).toBe(
      'image/png',
    )
  })

  it('tidak mengirim event submit ketika belum memilih file', async () => {
    const wrapper =
      mountModal()

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      wrapper.emitted('submit'),
    ).toBeUndefined()
  })

  it('tetap tidak mengirim event submit jika file bernilai null', async () => {
    const wrapper =
      mountModal()

    const fileInput =
      wrapper.find(
        'input[type="file"]',
      )

    Object.defineProperty(
      fileInput.element,
      'files',
      {
        value: [],
        writable: false,
      },
    )

    await fileInput.trigger(
      'change',
    )

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      wrapper.emitted('submit'),
    ).toBeUndefined()
  })

  it('memastikan form menggunakan submit handler', async () => {
    const wrapper =
      mountModal()

    const file =
      new File(
        ['cover'],
        'cover.webp',
        {
          type: 'image/webp',
        },
      )

    const fileInput =
      wrapper.find(
        'input[type="file"]',
      )

    Object.defineProperty(
      fileInput.element,
      'files',
      {
        value: [file],
        writable: false,
      },
    )

    await fileInput.trigger(
      'change',
    )

    expect(
      wrapper.emitted('submit'),
    ).toBeUndefined()

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      wrapper.emitted('submit'),
    ).toHaveLength(1)
  })

  it('menggunakan file terbaru ketika file diganti', async () => {
    const firstWrapper =
      mountModal()

    const firstFile =
      new File(
        ['first'],
        'first.jpg',
        {
          type: 'image/jpeg',
        },
      )

    const firstInput =
      firstWrapper.find(
        'input[type="file"]',
      )

    Object.defineProperty(
      firstInput.element,
      'files',
      {
        value: [firstFile],
        writable: false,
      },
    )

    await firstInput.trigger(
      'change',
    )

    const secondWrapper =
      mountModal()

    const secondFile =
      new File(
        ['second'],
        'second.jpg',
        {
          type: 'image/jpeg',
        },
      )

    const secondInput =
      secondWrapper.find(
        'input[type="file"]',
      )

    Object.defineProperty(
      secondInput.element,
      'files',
      {
        value: [secondFile],
        writable: false,
      },
    )

    await secondInput.trigger(
      'change',
    )

    await secondWrapper
      .find('form')
      .trigger('submit')

    expect(
      secondWrapper
        .emitted('submit')[0][0],
    ).toBe(secondFile)
  })
})