import 'reflect-metadata'

import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'
import { type User } from '@functions/user/entities/User'
import { FindAllUserUseCase } from '@functions/user/useCases/FindAll'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('FindAllUserUseCase', () => {
  let systemUnderTest: FindAllUserUseCase
  let userRepository: MockProxy<FindAllEntityRepository<User>>

  beforeAll(() => {
    userRepository = mock()
    userRepository.perform.mockResolvedValue([] as User[])
    systemUnderTest = new FindAllUserUseCase(userRepository)
  })

  it('should call FindAllUserRepository with correct params', async () => {
    await systemUnderTest.execute(true)

    expect(userRepository.perform).toHaveBeenCalledTimes(1)
  })

  it('should return an user array', async () => {
    const templateUsers: User[] = [
      {
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
    ]
    userRepository.perform.mockResolvedValueOnce(templateUsers)

    const result = await systemUnderTest.execute(true)

    expect(result).toEqual(templateUsers)
  })

  it('should return an empty array if no User was found', async () => {
    const result = await systemUnderTest.execute(true)

    expect(result).toEqual([])
  })
})
