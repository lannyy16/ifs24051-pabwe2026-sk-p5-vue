import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  mount,
} from '@vue/test-utils'

import BidModal from './BidModal.vue'

describe('BidModal', () => {
  function mountModal(
    props = {},
  ) {
    return mount(
      BidModal,
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
      'Ajukan Bid',
    )
  })

  it('menampilkan input nominal bid dengan atribut yang benar', () => {
    const wrapper =
      mountModal()

    const input =
      wrapper.find(
        'input[type="number"]',
      )

    expect(
      input.exists(),
    ).toBe(true)

    expect(
      input.attributes('min'),
    ).toBe('1')

    expect(
      input.attributes('required'),
    ).toBeDefined()

    expect(
      input.attributes('placeholder'),
    ).toBe('Nominal bid')
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

  it('menampilkan Bid Sekarang ketika tidak loading', () => {
    const wrapper =
      mountModal({
        loading: false,
      })

    expect(
      wrapper.text(),
    ).toContain(
      'Bid Sekarang',
    )

    expect(
      wrapper.text(),
    ).not.toContain(
      'Mengirim...',
    )
  })

  it('menampilkan Mengirim ketika loading', () => {
    const wrapper =
      mountModal({
        loading: true,
      })

    expect(
      wrapper.text(),
    ).toContain(
      'Mengirim...',
    )

    expect(
      wrapper.text(),
    ).not.toContain(
      'Bid Sekarang',
    )
  })

  it('mengirim nilai bid ketika form disubmit', async () => {
    const wrapper =
      mountModal()

    const input =
      wrapper.find(
        'input[type="number"]',
      )

    await input.setValue(50000)

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      wrapper.emitted('submit'),
    ).toHaveLength(1)

    expect(
      wrapper.emitted('submit')[0][0],
    ).toBe(50000)
  })

  it('menggunakan tipe number untuk nilai bid', async () => {
    const wrapper =
      mountModal()

    const input =
      wrapper.find(
        'input[type="number"]',
      )

    await input.setValue(75000)

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      typeof wrapper.emitted(
        'submit',
      )[0][0],
    ).toBe('number')
  })

  it('mengirim nilai bid terbaru ketika nominal diubah', async () => {
    const wrapper =
      mountModal()

    const input =
      wrapper.find(
        'input[type="number"]',
      )

    await input.setValue(25000)

    await input.setValue(100000)

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      wrapper.emitted(
        'submit',
      )[0][0],
    ).toBe(100000)
  })

  it('mengirim nilai kosong jika form disubmit tanpa mengisi bid', async () => {
    const wrapper =
      mountModal()

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      wrapper.emitted('submit'),
    ).toHaveLength(1)

    expect(
      wrapper.emitted(
        'submit',
      )[0][0],
    ).toBe('')
  })

  it('memastikan form menggunakan submit handler', async () => {
    const wrapper =
      mountModal()

    const input =
      wrapper.find(
        'input[type="number"]',
      )

    await input.setValue(150000)

    expect(
      wrapper.emitted('submit'),
    ).toBeUndefined()

    await wrapper
      .find('form')
      .trigger('submit')

    expect(
      wrapper.emitted('submit'),
    ).toHaveLength(1)

    expect(
      wrapper.emitted(
        'submit',
      )[0][0],
    ).toBe(150000)
  })
})