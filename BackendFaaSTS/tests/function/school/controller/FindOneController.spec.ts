import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { IDNotFoundError } from '@common/error/NotFoundError'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type FindOneUseCase } from '@common/domain/UseCase.interface'

import { School } from '@functions/school/entities/School'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { FindOneSchoolController } from '@functions/school/controller/FindOneController'

describe('FindOneSchoolController', () => {
  let templateSchool: School
  let templatePresentation: SchoolPM
  let systemUnderTest: FindOneSchoolController
  let schoolUseCases: MockProxy<FindOneUseCase<School>>
  let entityToPresentationModelMapper: MockProxy<Mapper<School, SchoolPM>>

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
    templatePresentation = {
      id: 'any_id',
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
    }
    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    schoolUseCases = mock()
    schoolUseCases.execute.mockResolvedValue(templateSchool)
    systemUnderTest = new FindOneSchoolController(schoolUseCases, entityToPresentationModelMapper)
  })

  it('should return 404 if useCase returns Error', async () => {
    schoolUseCases.execute.mockResolvedValueOnce(new IDNotFoundError('any_id', 'any_entity'))

    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 404, data: new IDNotFoundError('any_id', 'any_entity').message })
    expect(schoolUseCases.execute).toHaveBeenCalledWith('any_id')
    expect(schoolUseCases.execute).toHaveBeenCalledTimes(1)
  })

  it('should return 200 if useCase returns value', async () => {
    const result = await systemUnderTest.handle('any_id')

    expect(result).toEqual({ statusCode: 200, data: templatePresentation })
  })
})
