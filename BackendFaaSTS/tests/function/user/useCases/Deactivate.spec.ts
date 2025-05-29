import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { type User } from '@functions/user/entities/User'
import { type ActivateEntityRepository, type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'
import { DeactivateUserUseCase } from '@functions/user/useCases/Deactivate'
import { type AuthenticationService } from '@common/auth/AuthenticationService.interface'

describe('DeactivateUserUseCase', () => {
  let systemUnderTest: DeactivateUserUseCase
  let deactivateRepositoryMock: MockProxy<DeactivateEntityRepository<User>>
  let findOneUseCaseMock: MockProxy<FindOneUseCase<User>>
  let authServiceMock: MockProxy<AuthenticationService>
  let activateRepositoryCaseMock: MockProxy<ActivateEntityRepository<User>>
  let user: User

  beforeAll(() => {
    user = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      active: true,
      academicTitle: 'GRADUADO',
      courses: [],
      phone: 'any_phone',
      registerNumber: 'any_registerNumber',
      roles: 'any_role'
    }

    deactivateRepositoryMock = mock()
    findOneUseCaseMock = mock()
    authServiceMock = mock()
    activateRepositoryCaseMock = mock()

    findOneUseCaseMock.execute.mockResolvedValue(user)
    deactivateRepositoryMock.perform.mockResolvedValue(true)
    authServiceMock.disableUser.mockResolvedValue(true)
    activateRepositoryCaseMock.perform.mockResolvedValue(true)

    systemUnderTest = new DeactivateUserUseCase(deactivateRepositoryMock, findOneUseCaseMock, activateRepositoryCaseMock, authServiceMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should calls DeactivateUserMongoRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(deactivateRepositoryMock.perform).toHaveBeenCalledTimes(1)
    expect(deactivateRepositoryMock.perform).toHaveBeenCalledWith('any_id')
  })

  it('should calls FindOneUserMongoRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(findOneUseCaseMock.execute).toHaveBeenCalledTimes(1)
    expect(findOneUseCaseMock.execute).toHaveBeenCalledWith('any_id')
  })

  it('should calls AuthenticationService with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(authServiceMock.disableUser).toHaveBeenCalledTimes(1)
    expect(authServiceMock.disableUser).toHaveBeenCalledWith('any_email')
  })

  it('should return a message if user is not found', async () => {
    findOneUseCaseMock.execute.mockResolvedValueOnce(new Error())

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })

  it('should return a message if DeactivateUserMongoRepository return false', async () => {
    deactivateRepositoryMock.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })

  it('should return a message if AuthenticationService return false', async () => {
    authServiceMock.disableUser.mockResolvedValueOnce(false)
    deactivateRepositoryMock.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })
})
