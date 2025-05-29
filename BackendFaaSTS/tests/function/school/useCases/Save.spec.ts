import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'

import { School } from '@functions/school/entities/School'
import { errorLabel } from '@functions/school/adapter/repositories/MongoDB/utils'
import { SaveSchoolUseCase } from '@functions/school/useCases/Save'

describe('SaveSchoolUseCase', () => {
  let mockedError: MockProxy<MongoServerError>
  let templateSchool: School
  let schoolRepository: MockProxy<SaveEntityRepository<School>>
  let systemUnderTest: SaveSchoolUseCase

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
    systemUnderTest = new SaveSchoolUseCase(schoolRepository)
  })

  it('should return a School when schoolRepository.save returns', async () => {
    const result = await systemUnderTest.execute(templateSchool)

    expect(schoolRepository.perform).toHaveBeenCalledTimes(1)
    expect(schoolRepository.perform).toHaveBeenCalledWith(templateSchool)
    expect(result).toEqual(templateSchool)
  })

  it('should return a DuplicatedFieldError when schoolRepository.save throws', async () => {
    schoolRepository.perform.mockRejectedValueOnce(new DuplicatedFieldError({
      mongoError: mockedError,
      errorLabel,
      entity: templateSchool,
      possibleDuplicatedFields: 'name'
    }))

    const result = await systemUnderTest.execute(templateSchool)

    expect(result).toEqual(new DuplicatedFieldError({
      mongoError: mockedError,
      errorLabel,
      entity: templateSchool,
      possibleDuplicatedFields: 'name'
    }))
  })

  it('should return a InfraError when schoolRepository.save throws other error', async () => {
    schoolRepository.perform.mockRejectedValueOnce(new InfraError('Erro inesperado!'))

    const result = await systemUnderTest.execute(templateSchool)

    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })
})
