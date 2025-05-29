import 'reflect-metadata'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import {
  EntityNotFoundByNameError,
  IDNotFoundError
} from '@common/error/NotFoundError'
import {
  type FindOneEntityRepository,
  type UpdateEntityRepository
} from '@common/repository/RepositoryInterface'
import { type User } from '@functions/user/entities/User'
import { UpdateUserUseCase } from '@functions/user/useCases/Update'
import { errorLabel } from '@functions/user/adapter/repositories/MongoDB/utils'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'
import { type Course } from '@functions/course/entities/Course'
import { type AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { type UserUpdate } from '@functions/user/entities/UserUpdate'

describe('UpdateUserUseCase', () => {
  let systemUnderTest: UpdateUserUseCase
  let userUpdateRepository: MockProxy<UpdateEntityRepository<UserUpdate>>
  let courseRepository: MockProxy<FindOneEntityRepository<Course>>
  let userFindOneRepository: MockProxy<FindOneEntityRepository<User>>
  let authService: MockProxy<AuthenticationService>
  let mockedError: MockProxy<MongoServerError>
  let templateUser: User
  let templateCourse: Course

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }
    templateUser = {
      id: 'any_id',
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

    templateCourse = {
      id: 'any_id',
      name: 'any_name',
      code: 'any_code',
      acronym: 'any_acronym',
      coordinator: 'any_coordinator',
      schedule: ['any_schedule'],
      active: true
    }

    userFindOneRepository = mock()
    userUpdateRepository = mock()
    courseRepository = mock()
    authService = mock()

    courseRepository.perform.mockResolvedValue(templateCourse)
    userUpdateRepository.perform.mockResolvedValue(templateUser)
    userFindOneRepository.perform.mockResolvedValue(templateUser)
    authService.updateUserData.mockResolvedValue(true)

    systemUnderTest = new UpdateUserUseCase(
      userUpdateRepository,
      courseRepository,
      userFindOneRepository,
      authService
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call userUpdateRepository.update with correct params', async () => {
    await systemUnderTest.execute('any_id', templateUser)

    expect(userUpdateRepository.perform).toHaveBeenCalledTimes(1)
    expect(userUpdateRepository.perform).toHaveBeenCalledWith(
      templateUser,
      'any_id'
    )
  })

  it('should return a User when repo returns', async () => {
    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(templateUser)
  })

  it('should return NotFoundError when userUpdateRepository returns undefined', async () => {
    userUpdateRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(new IDNotFoundError('any_id', 'usuário'))
  })

  it('should return DuplicateFieldError when userUpdateRepository throws DuplicatedFieldError', async () => {
    userUpdateRepository.perform.mockRejectedValueOnce(
      new DuplicatedFieldError({
        entity: templateUser,
        errorLabel,
        mongoError: mockedError,
        possibleDuplicatedFields: 'any_field'
      })
    )

    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(
      new DuplicatedFieldError({
        entity: templateUser,
        errorLabel,
        mongoError: mockedError,
        possibleDuplicatedFields: 'any_field'
      })
    )
  })

  it('should return EntityNotFoundByNameError when userUpdateRepository throws EntityNotFoundByNameError', async () => {
    userUpdateRepository.perform.mockRejectedValueOnce(
      new EntityNotFoundByNameError('any_prop', 'any_entity')
    )

    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(
      new EntityNotFoundByNameError('any_prop', 'any_entity')
    )
  })

  it('should return InfraError when userUpdateRepository throws any other error', async () => {
    userUpdateRepository.perform.mockRejectedValueOnce(
      new Error('any_error')
    )

    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })

  it('should update an user without courses when user is not a professor', async () => {
    const user = { ...templateUser, roles: 'DIRETOR', courses: [] }

    await systemUnderTest.execute('any_id', user)

    expect(userUpdateRepository.perform).toHaveBeenCalledWith(
      { ...user, courses: [] },
      'any_id'
    )
  })

  it('should update an user without courses when user is not a professor', async () => {
    const user = { ...templateUser, roles: 'COORDENADOR', courses: [] }

    await systemUnderTest.execute('any_id', user)

    expect(userUpdateRepository.perform).toHaveBeenCalledWith(
      { ...user, courses: [] },
      'any_id'
    )
  })

  it('should return IDNotFoundError when is not found a course', async () => {
    courseRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(new IDNotFoundError('any_id', 'Curso'))
  })

  it('should call authService.updateUserData with correct params', async () => {
    await systemUnderTest.execute('any_id', templateUser)

    expect(authService.updateUserData).toHaveBeenCalledTimes(1)
    expect(authService.updateUserData).toHaveBeenCalledWith({
      email: templateUser.email,
      name: templateUser.name,
      role: templateUser.roles
    })
  })

  it('should return InfraError when authService.updateUserData throws any error', async () => {
    authService.updateUserData.mockRejectedValueOnce(
      new Error('any_error')
    )

    const result = await systemUnderTest.execute('any_id', templateUser)
    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })

  it('should not call authService.updateUserData when userUpdateRepository.update throws any error', async () => {
    userUpdateRepository.perform.mockRejectedValueOnce(
      new Error('any_error')
    )

    await systemUnderTest.execute('any_id', templateUser)
    expect(authService.updateUserData).toHaveBeenCalledTimes(0)
  })

  it('should return IDNotFoundError when userFindOneRepository returns undefined', async () => {
    userFindOneRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(new IDNotFoundError('any_id', 'usuário'))
  })

  it('should return IDNotFoundError when userFindOneRepository returns an inactive user', async () => {
    userFindOneRepository.perform.mockResolvedValueOnce({
      ...templateUser,
      active: false
    })

    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(new IDNotFoundError('any_id', 'usuário'))
  })

  it('should return IDNotFoundError when userFindOneRepository throws any error', async () => {
    userFindOneRepository.perform.mockRejectedValueOnce(
      new IDNotFoundError('any_id', 'usuário')
    )

    const result = await systemUnderTest.execute('any_id', templateUser)

    expect(result).toEqual(new IDNotFoundError('any_id', 'usuário'))
  })

  it('should not call subsequent methods when userFindOneRepository throws any error', async () => {
    userFindOneRepository.perform.mockRejectedValueOnce(
      new IDNotFoundError('any_id', 'usuário')
    )

    await systemUnderTest.execute('any_id', templateUser)

    expect(userUpdateRepository.perform).toHaveBeenCalledTimes(0)
    expect(courseRepository.perform).toHaveBeenCalledTimes(0)
    expect(authService.updateUserData).toHaveBeenCalledTimes(0)
  })

  it('should not call subsequent methods when userFindOneRepository returns undefined', async () => {
    userFindOneRepository.perform.mockResolvedValueOnce(undefined)

    await systemUnderTest.execute('any_id', templateUser)

    expect(userUpdateRepository.perform).toHaveBeenCalledTimes(0)
    expect(courseRepository.perform).toHaveBeenCalledTimes(0)
    expect(authService.updateUserData).toHaveBeenCalledTimes(0)
  })
})
