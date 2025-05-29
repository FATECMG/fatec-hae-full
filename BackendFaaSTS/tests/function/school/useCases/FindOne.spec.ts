import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { IDNotFoundError } from '@common/error/NotFoundError'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { School } from '@functions/school/entities/School'
import { FindOneSchoolUseCase } from '@functions/school/useCases/FindOne'

describe('FindOneSchoolUseCase', () => {
  let templateSchool: School
  let schoolRepository: MockProxy<FindOneEntityRepository<School>>
  let systemUnderTest: FindOneSchoolUseCase

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
    schoolRepository.perform.mockResolvedValue(templateSchool)
    systemUnderTest = new FindOneSchoolUseCase(schoolRepository)
  })

  it('should return NotFoundError when schoolRepository return undefined', async () => {
    schoolRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id')

    expect(schoolRepository.perform).toHaveBeenCalledTimes(1)
    expect(schoolRepository.perform).toHaveBeenCalledWith('any_id')
    expect(result).toEqual(new IDNotFoundError('any_id', 'escola'))
  })

  it('should return a School when schoolRepository returns', async () => {
    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual(templateSchool)
  })
})
