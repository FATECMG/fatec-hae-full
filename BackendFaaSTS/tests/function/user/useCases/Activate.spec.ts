import 'reflect-metadata'

import { type ActivateEntityRepository, type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'
import { type User } from '@functions/user/entities/User'
import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { type AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { ActivateUserUseCase } from '@functions/user/useCases/Activate'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('Activate User Use Case', () => {
  let systemUnderTest: ActivateUserUseCase
  let activateRepositoryMock: MockProxy<ActivateEntityRepository<User>>
  let findOneUseCaseMock: MockProxy<FindOneUseCase<User>>
  let authServiceMock: MockProxy<AuthenticationService>
  let deactivateRepositoryMock: MockProxy<DeactivateEntityRepository<User>>
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
    activateRepositoryMock = mock()
    findOneUseCaseMock = mock()
    authServiceMock = mock()
    deactivateRepositoryMock = mock()

    activateRepositoryMock.perform.mockResolvedValue(true)
    findOneUseCaseMock.execute.mockResolvedValue(user)
    authServiceMock.enableUser.mockResolvedValue(true)
    deactivateRepositoryMock.perform.mockResolvedValue(true)

    systemUnderTest = new ActivateUserUseCase(activateRepositoryMock, deactivateRepositoryMock, findOneUseCaseMock, authServiceMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should calls ActivateUserMongoRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(activateRepositoryMock.perform).toHaveBeenCalledTimes(1)
    expect(activateRepositoryMock.perform).toHaveBeenCalledWith('any_id')
  })

  it('should calls FindOneUserUseCase with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(findOneUseCaseMock.execute).toHaveBeenCalledTimes(1)
    expect(findOneUseCaseMock.execute).toHaveBeenCalledWith('any_id')
  })

  it('should calls AuthenticationService with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(authServiceMock.enableUser).toHaveBeenCalledTimes(1)
    expect(authServiceMock.enableUser).toHaveBeenCalledWith('any_email')
  })

  it('should return correct values', async () => {
    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: true, message: 'Ativado com sucesso' })
  })

  it('should return a message if user is not found', async () => {
    findOneUseCaseMock.execute.mockResolvedValueOnce(new Error())

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível ativar, tente novamente mais tarde!' })
  })

  it('should return a message if ActivateUserMongoRepository return false', async () => {
    activateRepositoryMock.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível ativar, tente novamente mais tarde!' })
  })

  it('should return a message if AuthenticationService return false', async () => {
    authServiceMock.enableUser.mockResolvedValueOnce(false)
    activateRepositoryMock.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível ativar, tente novamente mais tarde!' })
  })
})
