import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { type NewValidationSchema } from '@common/validation/Validate'
import { ValidationError } from '@common/error/ValidationError'
import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'

import { School } from '@functions/school/entities/School'
import { type SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { errorLabel } from '@functions/school/adapter/repositories/MongoDB/utils'
import { SaveSchoolController } from '@functions/school/controller/SaveController'

describe('SaveSchoolController', () => {
  let templateSchool: School
  let templateDto: SchoolDTO
  let templatePresentation: SchoolPM
  let systemUnderTest: SaveSchoolController
  let schoolUseCases: MockProxy<SaveUseCase<School>>
  let dtoValidator: MockProxy<NewValidationSchema>
  let dtoToEntityMapper: MockProxy<Mapper<SchoolDTO, School>>
  let entityToPresentationModelMapper: MockProxy<Mapper<School, SchoolPM>>
  let mockedError: MockProxy<MongoServerError>

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }
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
    templateDto = {
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
    dtoValidator = mock()
    dtoValidator.validate.mockImplementation(jest.fn(() => undefined))
    dtoToEntityMapper = mock()
    dtoToEntityMapper.execute.mockResolvedValue(templateSchool)
    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    schoolUseCases = mock()
    schoolUseCases.execute.mockResolvedValue(templateSchool)
    systemUnderTest = new SaveSchoolController(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, schoolUseCases)
  })
  it('should return 201 on useCases success', async () => {
    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 201, data: templatePresentation })
  })

  it('should return 400 on validator ValidationError', async () => {
    dtoValidator.validate.mockImplementationOnce(jest.fn(() => new ValidationError([{ field: 'any_field', message: 'any_error' }])))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 400, data: [{ field: 'any_field', message: 'any_error' }] })
  })

  it('should return 400 on useCases DuplicatedFieldError', async () => {
    schoolUseCases.execute.mockResolvedValueOnce(new DuplicatedFieldError({
      entity: templateSchool,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 400, data: { field: 'any_field', message: 'Foram enviados dados duplicados!' } })
  })

  it('should return 500 on useCases infra failure', async () => {
    schoolUseCases.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
