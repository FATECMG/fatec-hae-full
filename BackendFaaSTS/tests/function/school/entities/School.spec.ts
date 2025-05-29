import { type Address } from '@functions/school/entities/Address'
import { School } from '@functions/school/entities/School'

describe('School', () => {
  let templateAddress: Address

  beforeAll(() => {
    templateAddress = {
      city: 'any_city',
      district: 'any_district',
      postCode: 'any_postCode',
      state: 'any_state',
      street: 'any_street',
      number: 'any_number',
      complement: 'any_complement'
    }
  })

  it('should return a empty complement its undefined', () => {
    const sut = new School({ name: 'any_name', address: { ...templateAddress, complement: undefined }, active: true })
    expect(sut.address.complement).toBe('')
  })

  it('should return a empty complement its null', () => {
    const sut = new School({ name: 'any_name', address: { ...templateAddress, complement: null as any }, active: true })

    expect(sut.address.complement).toBe('')
  })

  it('should return the same complement if its sent', () => {
    const sut = new School({ name: 'any_name', address: { ...templateAddress }, active: true })

    expect(sut.address.complement).toBe('any_complement')
  })

  it('should return S/N if number its undefined', () => {
    const sut = new School({ name: 'any_name', address: { ...templateAddress, number: undefined }, active: true })

    expect(sut.address.number).toBe('S/N')
  })

  it('should return S/N if number its null', () => {
    const sut = new School({ name: 'any_name', address: { ...templateAddress, number: null as any }, active: true })

    expect(sut.address.number).toBe('S/N')
  })

  it('should return the same number if its sent', () => {
    const sut = new School({ name: 'any_name', address: { ...templateAddress }, active: true })

    expect(sut.address.number).toBe('any_number')
  })
})
