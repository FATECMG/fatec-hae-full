import 'reflect-metadata'

import { SchoolDtoToSchoolWithUppercasing } from '@functions/school/adapter/mapper'
import { SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { School } from '@functions/school/entities/School'

describe('SchoolDtoToSchoolWithUppercasing', () => {
  let baseSchool: SchoolDTO
  let systemUnderTest: SchoolDtoToSchoolWithUppercasing

  beforeAll(() => {
    systemUnderTest = new SchoolDtoToSchoolWithUppercasing()
    baseSchool = {
      name: 'any_name',
      address: {
        city: 'any_city',
        district: 'any_district',
        postCode: 'any_postCode',
        state: 'any_state',
        street: 'any_street',
        complement: 'any_complement',
        number: 'any_number'
      },
      active: true
    }
  })

  it('should map with the same data uppercased', async () => {
    const school = new SchoolDTO(baseSchool)

    const result = await systemUnderTest.execute(school)

    expect(result.address).toEqual({
      city: baseSchool.address.city.toLocaleUpperCase(),
      district: baseSchool.address.district.toLocaleUpperCase(),
      postCode: baseSchool.address.postCode,
      state: baseSchool.address.state.toLocaleUpperCase(),
      street: baseSchool.address.street.toLocaleUpperCase(),
      complement: baseSchool.address.complement?.toLocaleUpperCase() ?? undefined,
      number: baseSchool.address.number?.toLocaleUpperCase() ?? undefined
    })
    expect(result).toBeInstanceOf(School)
  })
})
