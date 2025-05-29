import 'reflect-metadata'

import { IDNotFoundError } from '@common/error/NotFoundError'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { FindOneUserUseCase } from '@functions/user/useCases/FindOne'
import { type User } from '@functions/user/entities/User'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('FindOneUserUseCase', () => {
  let templateUser: User
  let systemUnderTest: FindOneUserUseCase
  let findOneUserRepository: MockProxy<FindOneEntityRepository<User>>

  beforeAll(() => {
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
    findOneUserRepository = mock()
    systemUnderTest = new FindOneUserUseCase(findOneUserRepository)
  })

  it('should call FindOneUserRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(findOneUserRepository.perform).toHaveBeenCalledTimes(1)
    expect(findOneUserRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should returns a User when FindOneUserRepository returns', async () => {
    findOneUserRepository.perform.mockResolvedValueOnce(templateUser)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual(templateUser)
  })

  it('should returns a NotFoundError when FindOneUserRepository returns undefined', async () => {
    findOneUserRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual(new IDNotFoundError('any_id', 'usuário'))
  })
})
