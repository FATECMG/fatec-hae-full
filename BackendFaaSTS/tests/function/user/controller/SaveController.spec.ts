import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { ValidationError } from '@common/error/ValidationError'
import { User } from '@functions/user/entities/User'
import { type UserDTO } from '@functions/user/entities/dto/UserDTO'
import { SaveUserController } from '@functions/user/controller/SaveController'
import { errorLabel } from '@functions/user/adapter/repositories/MongoDB/utils'

describe('SaveUserController', () => {
  let templateDto: UserDTO
  let templateUser: User
  let templatePresentation: UserPresentationModel
  let systemUnderTest: SaveUserController
  let dtoValidator: MockProxy<NewValidationSchema>
  let dtoToEntityMapper: MockProxy<Mapper<UserDTO, User>>
  let entityToPresentationModelMapper: MockProxy<Mapper<User, UserPresentationModel>>
  let saveUserUseCase: MockProxy<SaveUseCase<User>>
  let mockedError: MockProxy<MongoServerError>

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }
    templateDto = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      roles: 'any_role',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      academicTitle: 'GRADUADO',
      phone: 'any_phone',
      registerNumber: 'any_registerNumber',
      active: true
    }
    templateUser = new User({ ...templateDto })
    templatePresentation = { ...templateUser }
    dtoValidator = mock()
    dtoToEntityMapper = mock()
    dtoToEntityMapper.execute.mockResolvedValue(templateUser)
    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    saveUserUseCase = mock()
    saveUserUseCase.execute.mockResolvedValue(templateUser)
    systemUnderTest = new SaveUserController(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, saveUserUseCase)
  })

  it('should return 201 on useCases.save success', async () => {
    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 201, data: templatePresentation })
  })

  it('should return 400 on validator ValidationError', async () => {
    dtoValidator.validate.mockImplementationOnce(jest.fn(() => new ValidationError([{ field: 'any_field', message: 'any_error' }])))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 400, data: [{ field: 'any_field', message: 'any_error' }] })
  })

  it('should return 400 on useCases.save DuplicatedFieldError', async () => {
    saveUserUseCase.execute.mockResolvedValueOnce(new DuplicatedFieldError({
      entity: templateUser,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 400, data: { field: 'any_field', message: 'Foram enviados dados duplicados!' } })
  })

  it('should return 500 on useCases.save infra failure', async () => {
    saveUserUseCase.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
