import 'reflect-metadata'

import { type FindOneEntityRepository, type SaveEntityRepository } from '@common/repository/RepositoryInterface'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { ValidationError } from '@common/error/ValidationError'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { AuthenticationError, UserDataAlreadyExistsError } from '@common/error/AuthenticationError'
import { type MongoServerError } from 'mongodb'
import { errorLabel } from '@functions/user/adapter/repositories/MongoDB/utils'
import { InfraError } from '@common/error/InfraError'

import { type AuthSignUpUseCase } from '@common/auth/SignUpUseCase.interface'
import { SaveUserUseCase } from '@functions/user/useCases/Save'

import { type User } from '@functions/user/entities/User'
import { type Course } from '@functions/course/entities/Course'

import { type EncryptString } from '@common/encryption/Encrypt'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('SaveUserUseCase', () => {
  let templateUser: User
  let systemUnderTest: SaveUserUseCase
  let userRepository: MockProxy<SaveEntityRepository<User>>
  let courseRepository: MockProxy<FindOneEntityRepository<Course>>
  let hashService: MockProxy<EncryptString>
  let mockedError: MockProxy<MongoServerError>
  let templateCourse: Course
  let SignUpAuthUseCase: MockProxy<AuthSignUpUseCase>

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }

    templateUser = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'AnyPassword123@',
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

    templateCourse = {
      id: 'any_id',
      name: 'any_name',
      code: 'any_code',
      acronym: 'any_acronym',
      coordinator: 'any_coordinator',
      schedule: ['any_schedule'],
      active: true
    }

    userRepository = mock()
    courseRepository = mock()
    SignUpAuthUseCase = mock()
    hashService = mock()
    courseRepository.perform.mockResolvedValue(templateCourse)
    userRepository.perform.mockResolvedValue(templateUser)
    SignUpAuthUseCase.execute.mockResolvedValue(true)
    hashService.hashPassword.mockReturnValue('AnyPassword123@')
    systemUnderTest = new SaveUserUseCase(userRepository, courseRepository, SignUpAuthUseCase, hashService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should calls SaveUserMongoRepository with correct params', async () => {
    await systemUnderTest.execute(templateUser)

    expect(userRepository.perform).toHaveBeenCalledTimes(1)
    expect(userRepository.perform).toHaveBeenCalledWith(templateUser)
  })

  it('should return a User when repo returns', async () => {
    const result = await systemUnderTest.execute(templateUser)

    expect(result).toEqual(templateUser)
  })

  it('should return DuplicatedFieldError when Repo return DuplicatedFieldError', async () => {
    userRepository.perform.mockRejectedValueOnce(new DuplicatedFieldError({
      entity: templateUser,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.execute(templateUser)

    expect(result).toEqual(new DuplicatedFieldError({
      entity: templateUser,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))
  })

  it('should return ValidationError when AuthService return ValidationError', async () => {
    SignUpAuthUseCase.execute.mockRejectedValueOnce(new ValidationError([{ field: 'any_field', message: 'any_error' }]))

    const result = await systemUnderTest.execute(templateUser)

    expect(result).toEqual(new ValidationError([{ field: 'any_field', message: 'any_error' }]))
  })

  it('should return InfraError when Repo throws unexpected error', async () => {
    userRepository.perform.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.execute(templateUser)

    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })

  it('should create an user without courses when user is not a professor', async () => {
    const user = { ...templateUser, roles: 'DIRETOR', courses: [] }

    await systemUnderTest.execute(user)

    expect(userRepository.perform).toHaveBeenCalledWith({ ...user, courses: [] })
  })

  it('should create an user without courses when user is not a professor', async () => {
    const user = { ...templateUser, roles: 'COORDENADOR', courses: [] }

    await systemUnderTest.execute(user)

    expect(userRepository.perform).toHaveBeenCalledWith({ ...user, courses: [] })
  })

  it('should return IDNotFoundError when is not found a course', async () => {
    courseRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute(templateUser)

    expect(result).toEqual(new IDNotFoundError('any_id', 'Curso'))
  })

  it('should return AuthError when AuthSignUpUseCase throws UserDataAlreadyExistsError', async () => {
    SignUpAuthUseCase.execute.mockRejectedValueOnce(new UserDataAlreadyExistsError('any_field'))

    const result = await systemUnderTest.execute(templateUser)

    expect(result).toBeInstanceOf(AuthenticationError)
  })

  it('should return InfraError when AuthSignUpUseCase throws unexpected error', async () => {
    SignUpAuthUseCase.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.execute(templateUser)

    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })
})
