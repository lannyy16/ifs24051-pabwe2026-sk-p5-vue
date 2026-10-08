import { describe, expect, it } from 'vitest'
import { useInput } from './useInput'

describe('useInput', () => {
  it('menggunakan nilai awal yang diberikan', () => {
    const input = useInput('Karina')

    expect(input.value.value).toBe('Karina')
    expect(input.model.value).toBe('Karina')
  })

  it('menggunakan nilai kosong jika tidak diberikan nilai awal', () => {
    const input = useInput()

    expect(input.value.value).toBe('')
    expect(input.model.value).toBe('')
  })

  it('mengubah value melalui model setter', () => {
    const input = useInput('Awal')

    input.model.value = 'Baru'

    expect(input.value.value).toBe('Baru')
    expect(input.model.value).toBe('Baru')
  })

  it('mengubah value secara langsung', () => {
    const input = useInput('Awal')

    input.value.value = 'Langsung'

    expect(input.model.value).toBe('Langsung')
  })

  it('mereset value ke nilai awal', () => {
    const input = useInput('Karina')

    input.model.value = 'Nilai Baru'

    expect(input.value.value).toBe('Nilai Baru')

    input.reset()

    expect(input.value.value).toBe('Karina')
    expect(input.model.value).toBe('Karina')
  })

  it('mereset ke string kosong jika nilai awal kosong', () => {
    const input = useInput()

    input.model.value = 'Data Baru'

    input.reset()

    expect(input.value.value).toBe('')
    expect(input.model.value).toBe('')
  })
})