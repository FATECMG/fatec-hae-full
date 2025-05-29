import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { IDNotFoundError } from '@common/error/NotFoundError'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'

import { UpdateSchoolUseCase } from '@functions/school/useCases/Update'
import { School } from '@functions/school/entities/School'
import { errorLabel } from '@functions/school/adapter/repositories/MongoDB/utils'

describe('SchoolUseCases', () => {
  let mockedError: MockProxy<MongoServerError>
  let templateSchool: School
  let schoolRepository: MockProxy<UpdateEntityRepository<School>>
  let systemUnderTest: UpdateSchoolUseCase

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { name: 1 }
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
    systemUnderTest = new UpdateSchoolUseCase(schoolRepository)
  })

  it('should return a School when schoolRepository returns', async () => {
    const result = await systemUnderTest.execute('any_id', templateSchool)

    expect(schoolRepository.perform).toHaveBeenCalledTimes(1)
    expect(schoolRepository.perform).toHaveBeenCalledWith(templateSchool, 'any_id')
    expect(result).toEqual(templateSchool)
  })

  it('should return a NotFoundError when schoolRepository does not find any school', async () => {
    schoolRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id', templateSchool)

    expect(result).toEqual(new IDNotFoundError('any_id', 'escola'))
  })

  it('should return a DuplicatedFieldError when schoolRepository throws', async () => {
    schoolRepository.perform.mockRejectedValueOnce(new DuplicatedFieldError({
      mongoError: mockedError,
      errorLabel,
      entity: templateSchool,
      possibleDuplicatedFields: 'name'
    }))

    const result = await systemUnderTest.execute('any_id', templateSchool)

    expect(result).toEqual(new DuplicatedFieldError({
      mongoError: mockedError,
      errorLabel,
      entity: templateSchool,
      possibleDuplicatedFields: 'name'
    }))
  })

  it('should return a InfraError when schoolRepository throws other error', async () => {
    schoolRepository.perform.mockRejectedValueOnce(new InfraError('Erro inesperado!'))

    const result = await systemUnderTest.execute('any_id', templateSchool)

    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })
})
