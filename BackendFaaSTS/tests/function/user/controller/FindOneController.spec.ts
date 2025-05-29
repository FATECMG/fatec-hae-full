import 'reflect-metadata'

import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { User } from '@functions/user/entities/User'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { FindOneUserController } from '@functions/user/controller/FindOneController'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('FindOneUserController', () => {
  let templateUser: User
  let templateUserPM: UserPresentationModel
  let systemUnderTest: FindOneUserController
  let findOneUserUseCase: MockProxy<FindOneUseCase<User>>
  let userToPresentationModelMapper: MockProxy<Mapper<User, UserPresentationModel>>

  beforeAll(() => {
    templateUserPM = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
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
    templateUser = new User({ ...templateUserPM, password: 'any_password' })
    findOneUserUseCase = mock()
    findOneUserUseCase.execute.mockResolvedValue(templateUser)
    userToPresentationModelMapper = mock()
    userToPresentationModelMapper.execute.mockResolvedValue(templateUserPM)
    systemUnderTest = new FindOneUserController(findOneUserUseCase, userToPresentationModelMapper)
  })

  it('should return 404 if no user was found', async () => {
    findOneUserUseCase.execute.mockResolvedValueOnce(new Error('any_error'))

    const promise = systemUnderTest.handle('any_id')

    await expect(promise).resolves.toEqual({
      statusCode: 404,
      data: 'any_error'
    })
  })

  it('should return 200 if user was found', async () => {
    const promise = systemUnderTest.handle('any_id')

    await expect(promise).resolves.toEqual({
      statusCode: 200,
      data: templateUserPM
    })
  })
})
