import 'reflect-metadata'

import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { User } from '@functions/user/entities/User'
import { type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { FindAllUserController } from '@functions/user/controller/FindAllController'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('FindAllUserController', () => {
  let templateUser: User
  let systemUnderTest: FindAllUserController
  let findAllUserUseCase: MockProxy<FindAllUseCase<User>>
  let userToPresentationModelMapper: MockProxy<Mapper<User, UserPresentationModel>>

  beforeAll(() => {
    templateUser = new User({
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
    findAllUserUseCase = mock()
    findAllUserUseCase.execute.mockResolvedValue([templateUser])
    userToPresentationModelMapper = mock()
    userToPresentationModelMapper.execute.mockResolvedValue({ ...templateUser })
    systemUnderTest = new FindAllUserController(userToPresentationModelMapper, findAllUserUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle(true)

    expect(result).toEqual({ statusCode: 200, data: [templateUser] })
  })
})
