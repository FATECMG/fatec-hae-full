import 'reflect-metadata'

import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'
import { DeleteUserUseCase } from '@functions/user/useCases/Delete'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type User } from '@functions/user/entities/User'
import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { type AuthenticationService } from '@common/auth/AuthenticationService.interface'

describe('DeleteUserUseCase', () => {
  let systemUnderTest: DeleteUserUseCase
  let userRepository: MockProxy<DeleteEntityRepository>
  let findOneMock: MockProxy<FindOneUseCase<User>>
  let authServiceMock: MockProxy<AuthenticationService>

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
    userRepository = mock()
    findOneMock = mock()
    authServiceMock = mock()

    findOneMock.execute.mockResolvedValue(user)
    authServiceMock.deleteUser.mockResolvedValue(true)
    authServiceMock.disableUser.mockResolvedValue(true)
    userRepository.perform.mockResolvedValue(true)

    systemUnderTest = new DeleteUserUseCase(userRepository, findOneMock, authServiceMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should calls DeleteUserMongoRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(userRepository.perform).toHaveBeenCalledTimes(1)
    expect(userRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should calls FindOneUserMongoRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(findOneMock.execute).toHaveBeenCalledTimes(1)
    expect(findOneMock.execute).toHaveBeenCalledWith('any_id')
  })

  it('should calls disableUser from AuthenticationService with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(authServiceMock.disableUser).toHaveBeenCalledTimes(1)
    expect(authServiceMock.disableUser).toHaveBeenCalledWith('any_email')
  })

  it('should calls deleteUser from AuthenticationService with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(authServiceMock.deleteUser).toHaveBeenCalledTimes(1)
    expect(authServiceMock.deleteUser).toHaveBeenCalledWith('any_email')
  })

  it('should return error message when FindOneUserMongoRepository return error', async () => {
    findOneMock.execute.mockResolvedValueOnce(new Error('any_error'))

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })

  it('should return error message when disableUser from AuthenticationService return error', async () => {
    authServiceMock.disableUser.mockResolvedValueOnce(false)
    const result = await systemUnderTest.execute('any_id')
    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })

  it('should return error message when DeleteUserMongoRepository return error', async () => {
    userRepository.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })

  it('should return success message when Repo return true', async () => {
    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: true, message: 'Excluído com sucesso!' })
  })

  it('should return error message when Repo return false', async () => {
    userRepository.perform.mockResolvedValueOnce(false)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual({ deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' })
  })
})
