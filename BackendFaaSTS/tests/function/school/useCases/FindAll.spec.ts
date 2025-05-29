import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { School } from '@functions/school/entities/School'
import { FindAllSchoolsUseCase } from '@functions/school/useCases/FindAll'

describe('FindAllSchoolsUseCase', () => {
  let templateSchool: School
  let schoolRepository: MockProxy<FindAllEntityRepository<School>>
  let systemUnderTest: FindAllSchoolsUseCase

  beforeAll(() => {
    templateSchool = new School({
      name: 'any_name',
      address: {
        city: 'any_city',
        complement: 'any_complement',
        district: 'any_district',
        number: 'any_number',
        postCode: 'any_postCode',
        state: 'any_state',
        street: 'any_street'
      },
      active: true
    })
    schoolRepository = mock()
    schoolRepository.perform.mockResolvedValue([templateSchool])
    systemUnderTest = new FindAllSchoolsUseCase(schoolRepository)
  })

  it('should return a School Array when schoolRepository returns', async () => {
    const result = await systemUnderTest.execute(true)

    expect(schoolRepository.perform).toHaveBeenCalledTimes(1)
    expect(result).toEqual([templateSchool])
  })

  it('should return a empty School Array when schoolRepository returns', async () => {
    schoolRepository.perform.mockResolvedValueOnce([])

    const result = await systemUnderTest.execute(true)

    expect(result).toEqual([])
  })
})
