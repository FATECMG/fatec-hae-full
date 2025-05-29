import 'reflect-metadata'

import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { EntityNotFoundByNameError, IDNotFoundError } from '@common/error/NotFoundError'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import { User } from '@functions/user/entities/User'
import { UserDTO } from '@functions/user/entities/dto/UserDTO'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { UpdateUserController } from '@functions/user/controller/UpdateController'
import { type UserUpdateDTO } from '@functions/user/entities/dto/UserUpdateDTO'
import { errorLabel } from '@functions/user/adapter/repositories/MongoDB/utils'

import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'
import { type UserUpdate } from '@functions/user/entities/UserUpdate'

describe('UpdateUserController', () => {
  let templateDto: UserDTO
  let templateUser: User
  let templatePresentation: UserPresentationModel
  let systemUnderTest: UpdateUserController
  let dtoValidator: MockProxy<NewValidationSchema>
  let dtoToEntityMapper: MockProxy<Mapper<UserUpdateDTO, User>>
  let entityToPresentationModelMapper: MockProxy<Mapper<UserUpdate, UserPresentationModel>>
  let updateUserUseCase: MockProxy<UpdateUseCase<UserUpdate>>
  let mockedError: MockProxy<MongoServerError>

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }
    templateDto = new UserDTO({
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
    })
    templateUser = new User({ ...templateDto })
    templatePresentation = { ...templateUser }
    dtoValidator = mock()
    dtoToEntityMapper = mock()
    dtoToEntityMapper.execute.mockResolvedValue(templateUser)
    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    updateUserUseCase = mock()
    updateUserUseCase.execute.mockResolvedValue(templateUser)
    systemUnderTest = new UpdateUserController(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, updateUserUseCase)
  })

  it('should return 200 on useCase.update success', async () => {
    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 200, data: templatePresentation })
  })

  it('should return 400 on useCases.update DuplicatedFieldError', async () => {
    updateUserUseCase.execute.mockResolvedValueOnce(new DuplicatedFieldError({
      entity: templateUser,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 400, data: { field: 'any_field', message: 'Foram enviados dados duplicados!' } })
  })

  it('should return 404 on useCases.update IDNotFoundError', async () => {
    updateUserUseCase.execute.mockResolvedValueOnce(new IDNotFoundError('any_id', 'any_entity'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 404, data: { field: 'ID', message: new IDNotFoundError('any_id', 'any_entity').message } })
  })

  it('should return 404 on useCases.update EntityNotFoundByNameError', async () => {
    updateUserUseCase.execute.mockResolvedValueOnce(new EntityNotFoundByNameError('any_prop', 'any_entity'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 404, data: { field: 'Nome', message: new EntityNotFoundByNameError('any_prop', 'any_entity').message } })
  })

  it('should return 500 on useCases.update infra failure', async () => {
    updateUserUseCase.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
