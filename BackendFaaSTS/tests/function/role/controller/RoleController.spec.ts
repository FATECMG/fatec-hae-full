import 'reflect-metadata'

import { InfraError } from '@common/error/InfraError'
import { RoleController } from '@functions/role/controller/RoleController'
import { Role } from '@functions/role/entities/Role'
import { type IRoleUseCases } from '@functions/role/useCases/RoleUseCases.interface'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('RoleController', () => {
  let systemUnderTest: RoleController
  let roleUseCases: MockProxy<IRoleUseCases>
  let someRoles: Role[]

  beforeAll(() => {
    someRoles = [new Role({ name: 'any_role' }), new Role({ name: 'any_role2' })]
    roleUseCases = mock()
    roleUseCases.findAll.mockResolvedValue(someRoles)
    systemUnderTest = new RoleController(roleUseCases)
  })

  it('should call RoleUseCases correctly', async () => {
    await systemUnderTest.handle()

    expect(roleUseCases.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return 200 on success', async () => {
    const response = await systemUnderTest.handle()

    expect(response).toEqual({
      statusCode: 200,
      data: someRoles
    })
  })

  it('should return 500 if repository throws', async () => {
    roleUseCases.findAll.mockRejectedValueOnce(new InfraError('infra_error'))

    const response = await systemUnderTest.handle()

    expect(response).toEqual({
      statusCode: 500,
      data: new InfraError('infra_error').message
    })
  })
})
