import { SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { type AddressDTO } from '@functions/school/entities/dto/AddressDTO'

describe('SchoolDTO', () => {
  let templateAddress: AddressDTO

  beforeAll(() => {
    templateAddress = {
      city: 'any_city',
      district: 'any_district',
      postCode: 'any_postCode',
      state: 'any_state',
      street: 'any_street'
    }
  })

  it('should return the same complement if its sent', () => {
    const sut = new SchoolDTO({
      name: 'any_name',
      address: { ...templateAddress, complement: 'any_complement' }
    })

    expect(sut.address.complement).toBe('any_complement')
  })

  it('should return undefined if number it is not sent', () => {
    const sut = new SchoolDTO({
      name: 'any_name',
      address: { ...templateAddress }
    })

    expect(sut.address.number).toBe(undefined)
  })

  it('should return undefined if number it is not sent', () => {
    const sut = new SchoolDTO({
      name: 'any_name',
      address: { ...templateAddress }
    })

    expect(sut.address.complement).toBe(undefined)
  })

  it('should return the same number if its sent', () => {
    const sut = new SchoolDTO({
      name: 'any_name',
      address: { ...templateAddress, number: 'any_number' }
    })

    expect(sut.address.number).toBe('any_number')
  })
})
