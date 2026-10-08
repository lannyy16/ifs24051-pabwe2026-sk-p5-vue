import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import AddModal from './AddModal.vue'

describe('AddModal', () => {
  function mountModal(
    props = {},
  ) {
    return mount(
      AddModal,
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
      'Tambah Lelang',
    )
  })

  it('menampilkan seluruh input form', () => {
    const wrapper =
      mountModal()

    expect(
      wrapper.find(
        'input[type="text"]',
      ).exists(),
    ).toBe(true)

    expect(
      wrapper.find('textarea').exists(),
    ).toBe(true)

    expect(
      wrapper.find(
        'input[type="number"]',
      ).exists(),
    ).toBe(true)

    expect(
      wrapper.find(
        'input[type="datetime-local"]',
      ).exists(),
    ).toBe(true)

    expect(
      wrapper.find(
        'input[type="file"]',
      ).exists(),
    ).toBe(true)
  })

  it('menampilkan tombol Simpan ketika tidak loading', () => {
    const wrapper =
      mountModal({
        loading: false,
      })

    const submitButton =
      wrapper.find(
        'button[type="submit"]',
      )

    expect(
      submitButton.text(),
    ).toBe('Simpan')

    expect(
      submitButton.attributes(
        'disabled',
      ),
    ).toBeUndefined()
  })

  it('menampilkan Menyimpan ketika loading', () => {
    const wrapper =
      mountModal({
        loading: true,
      })

    const submitButton =
      wrapper.find(
        'button[type="submit"]',
      )

    expect(
      submitButton.text(),
    ).toBe('Menyimpan...')

    expect(
      submitButton.attributes(
        'disabled',
      ),
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

  it('mengubah nilai form melalui input', async () => {
    const wrapper =
      mountModal()

    const titleInput =
      wrapper.find(
        'input[type="text"]',
      )

    const descriptionInput =
      wrapper.find('textarea')

    const startBidInput =
      wrapper.find(
        'input[type="number"]',
      )

    const closedAtInput =
      wrapper.find(
        'input[type="datetime-local"]',
      )

    await titleInput.setValue(
      'Laptop ASUS',
    )

    await descriptionInput.setValue(
      'Laptop bekas',
    )

    await startBidInput.setValue(
      '1500000',
    )

    await closedAtInput.setValue(
      '2026-10-10T18:30',
    )

    expect(
      titleInput.element.value,
    ).toBe('Laptop ASUS')

    expect(
      descriptionInput.element.value,
    ).toBe('Laptop bekas')

    expect(
      Number(
        startBidInput.element.value,
      ),
    ).toBe(1500000)

    expect(
      closedAtInput.element.value,
    ).toBe(
      '2026-10-10T18:30',
    )
  })

  it('menyimpan file cover ketika file dipilih', async () => {
    const wrapper =
      mountModal()

    const file =
      new File(
        ['image'],
        'laptop.jpg',
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
        configurable: true,
      },
    )

    await fileInput.trigger(
      'change',
    )

    expect(
      fileInput.element.files[0],
    ).toBe(file)
  })

  it('menggunakan null ketika tidak ada file yang dipilih', async () => {
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
        configurable: true,
      },
    )

    await fileInput.trigger(
      'change',
    )

    expect(
      fileInput.element.files,
    ).toHaveLength(0)
  })

  it('mengirim data form ketika submit', async () => {
    const wrapper =
      mountModal()

    await wrapper
      .find('input[type="text"]')
      .setValue('Laptop ASUS')

    await wrapper
      .find('textarea')
      .setValue('Laptop bekas')

    await wrapper
      .find('input[type="number"]')
      .setValue('1500000')

    await wrapper
      .find(
        'input[type="datetime-local"]',
      )
      .setValue(
        '2026-10-10T18:30',
      )

    const file =
      new File(
        ['image'],
        'laptop.jpg',
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
        configurable: true,
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

    expect(events[0][0]).toMatchObject({
      title: 'Laptop ASUS',
      description: 'Laptop bekas',
      start_bid: 1500000,
      closed_at:
        '2026-10-10 18:30:00',
      cover: file,
    })
  })

  it('mengirim closed_at kosong ketika waktu penutupan tidak diisi', async () => {
    const wrapper =
      mountModal()

    await wrapper
      .find('input[type="text"]')
      .setValue('Laptop')

    await wrapper
      .find('textarea')
      .setValue('Laptop bekas')

    await wrapper
      .find('input[type="number"]')
      .setValue('1000000')

    await wrapper
      .find('form')
      .trigger('submit')

    const events =
      wrapper.emitted('submit')

    expect(events).toHaveLength(1)

    expect(
      events[0][0].closed_at,
    ).toBe('')
  })
})