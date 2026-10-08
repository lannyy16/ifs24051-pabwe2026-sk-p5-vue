import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import ChangeModal from './ChangeModal.vue'

describe('ChangeModal', () => {
  function mountModal(
    props = {},
  ) {
    return mount(
      ChangeModal,
      {
        props: {
          open: true,
          loading: false,
          aucation: null,
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
      'Ubah Lelang',
    )
  })

  it('mengisi form dari data aucation', () => {
    const wrapper =
      mountModal({
        aucation: {
          title: 'Laptop ASUS',
          description: 'Laptop bekas',
          start_bid: 1500000,
          closed_at:
            '2026-10-10 18:30:00',
        },
      })

    const titleInput =
      wrapper.find(
        'input:not([type])',
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

  it('mengosongkan form ketika aucation null', () => {
    const wrapper =
      mountModal({
        aucation: null,
      })

    expect(
      wrapper.find(
        'input:not([type])',
      ).element.value,
    ).toBe('')

    expect(
      wrapper
        .find('textarea')
        .element.value,
    ).toBe('')

    expect(
      wrapper
        .find(
          'input[type="number"]',
        )
        .element.value,
    ).toBe('')

    expect(
      wrapper
        .find(
          'input[type="datetime-local"]',
        )
        .element.value,
    ).toBe('')
  })

  it('mengosongkan closed_at ketika data aucation tidak memiliki closed_at', () => {
    const wrapper =
      mountModal({
        aucation: {
          title: 'Laptop',
          description: 'Barang',
          start_bid: 1000000,
          closed_at: null,
        },
      })

    expect(
      wrapper
        .find(
          'input[type="datetime-local"]',
        )
        .element.value,
    ).toBe('')
  })

  it('menggunakan nilai default ketika field aucation kosong', () => {
    const wrapper =
      mountModal({
        aucation: {
          title: '',
          description: '',
          start_bid: 0,
          closed_at: '',
        },
      })

    expect(
      wrapper.find(
        'input:not([type])',
      ).element.value,
    ).toBe('')

    expect(
      wrapper
        .find('textarea')
        .element.value,
    ).toBe('')

    expect(
      wrapper
        .find(
          'input[type="number"]',
        )
        .element.value,
    ).toBe('')

    expect(
      wrapper
        .find(
          'input[type="datetime-local"]',
        )
        .element.value,
    ).toBe('')
  })

  it('mengubah data form melalui input', async () => {
    const wrapper =
      mountModal()

    const titleInput =
      wrapper.find(
        'input:not([type])',
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
      'HP Samsung',
    )

    await descriptionInput.setValue(
      'HP bekas',
    )

    await startBidInput.setValue(
      '2000000',
    )

    await closedAtInput.setValue(
      '2026-11-01T10:00',
    )

    expect(
      titleInput.element.value,
    ).toBe('HP Samsung')

    expect(
      descriptionInput.element.value,
    ).toBe('HP bekas')

    expect(
      Number(
        startBidInput.element.value,
      ),
    ).toBe(2000000)

    expect(
      closedAtInput.element.value,
    ).toBe(
      '2026-11-01T10:00',
    )
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

  it('menampilkan Simpan ketika tidak loading', () => {
    const wrapper =
      mountModal({
        loading: false,
      })

    const submitButton =
      wrapper
        .findAll('button')
        .find(
          (button) =>
            button.text() === 'Simpan',
        )

    expect(
      submitButton.exists(),
    ).toBe(true)

    expect(
      submitButton.text(),
    ).toBe('Simpan')
  })

  it('menampilkan Menyimpan ketika loading', () => {
    const wrapper =
      mountModal({
        loading: true,
      })

    const submitButton =
      wrapper
        .findAll('button')
        .find(
          (button) =>
            button.text() ===
            'Menyimpan...',
        )

    expect(
      submitButton.exists(),
    ).toBe(true)

    expect(
      submitButton.text(),
    ).toBe('Menyimpan...')
  })

  it('mengirim data form ketika submit', async () => {
    const wrapper =
      mountModal({
        aucation: {
          title: 'Laptop ASUS',
          description: 'Laptop bekas',
          start_bid: 1500000,
          closed_at:
            '2026-10-10 18:30:00',
        },
      })

    await wrapper
      .find('form')
      .trigger('submit')

    const events =
      wrapper.emitted('submit')

    expect(events).toHaveLength(1)

    expect(
      events[0][0],
    ).toEqual({
      title: 'Laptop ASUS',
      description: 'Laptop bekas',
      start_bid: 1500000,
      closed_at:
        '2026-10-10 18:30',
    })
  })

  it('mengirim form kosong ketika tidak ada aucation', async () => {
    const wrapper =
      mountModal({
        aucation: null,
      })

    await wrapper
      .find('form')
      .trigger('submit')

    const events =
      wrapper.emitted('submit')

    expect(events).toHaveLength(1)

    expect(
      events[0][0],
    ).toEqual({
      title: '',
      description: '',
      start_bid: '',
      closed_at: '',
    })
  })

  it('memperbarui form ketika props aucation berubah', async () => {
    const wrapper =
      mountModal({
        aucation: {
          title: 'Laptop',
          description: 'Laptop lama',
          start_bid: 1000000,
          closed_at:
            '2026-10-10 10:00:00',
        },
      })

    expect(
      wrapper.find(
        'input:not([type])',
      ).element.value,
    ).toBe('Laptop')

    await wrapper.setProps({
      aucation: {
        title: 'Kamera',
        description: 'Kamera bekas',
        start_bid: 2500000,
        closed_at:
          '2026-12-20 15:45:30',
      },
    })

    expect(
      wrapper.find(
        'input:not([type])',
      ).element.value,
    ).toBe('Kamera')

    expect(
      wrapper
        .find('textarea')
        .element.value,
    ).toBe('Kamera bekas')

    expect(
      Number(
        wrapper
          .find(
            'input[type="number"]',
          )
          .element.value,
      ),
    ).toBe(2500000)

    expect(
      wrapper
        .find(
          'input[type="datetime-local"]',
        )
        .element.value,
    ).toBe(
      '2026-12-20T15:45',
    )
  })
})