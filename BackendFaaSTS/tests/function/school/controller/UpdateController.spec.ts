import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type NewValidationSchema } from '@common/validation/Validate'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type UpdateUseCase } from '@common/domain/UseCase.interface'

import { School } from '@functions/school/entities/School'
import { type SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { errorLabel } from '@functions/school/adapter/repositories/MongoDB/utils'
import { UpdateSchoolController } from '@functions/school/controller/UpdateController'

describe('SchoolController', () => {
  let templateSchool: School
  let templateDto: SchoolDTO
  let templatePresentation: SchoolPM
  let systemUnderTest: UpdateSchoolController
  let schoolUseCases: MockProxy<UpdateUseCase<School>>
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
    systemUnderTest = new UpdateSchoolController(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, schoolUseCases)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 200, data: templatePresentation })
  })

  it('should return 400 on useCases DuplicatedFieldError', async () => {
    schoolUseCases.execute.mockResolvedValueOnce(new DuplicatedFieldError({
      entity: templateSchool,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 400, data: { field: 'any_field', message: 'Foram enviados dados duplicados!' } })
  })

  it('should return 404 on useCases NotFoundError', async () => {
    schoolUseCases.execute.mockResolvedValueOnce(new IDNotFoundError('any_id', 'any_entity'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({
      statusCode: 404,
      data: {
        field: 'ID',
        message: 'Não foi possível encontrar any_entity com id: any_id'
      }
    })
  })

  it('should return 500 on useCases infra failure', async () => {
    schoolUseCases.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
