import 'reflect-metadata'

import { InfraError } from '@common/error/InfraError'
import { type IRoleRepository } from '@functions/role/adapter/repositories/RoleRepository'
import { Role } from '@functions/role/entities/Role'
import { RoleUseCases } from '@functions/role/useCases/RoleUseCases'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('RoleUseCases', () => {
  let systemUnderTest: RoleUseCases
  let roleRepository: MockProxy<IRoleRepository>

  beforeAll(() => {
    const someRoles = [new Role({ name: 'any_role' }), new Role({ name: 'any_role2' })]
    roleRepository = mock()
    roleRepository.findAll.mockResolvedValue(someRoles)
    systemUnderTest = new RoleUseCases(roleRepository)
  })

  it('should call RoleRepository', async () => {
    await systemUnderTest.findAll()

    expect(roleRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return an Role array on success', async () => {
    const roles = await systemUnderTest.findAll()

    expect(roles.length).toBe(2)
  })

  it('should return an empty array when there is no role saved', async () => {
    roleRepository.findAll.mockResolvedValueOnce([] as Role[])

    const roles = await systemUnderTest.findAll()

    expect(roles.length).toBe(0)
  })

  it('should rethrow infra error if repository throw', async () => {
    roleRepository.findAll.mockRejectedValueOnce(new InfraError('infra_error'))

    const response = systemUnderTest.findAll()

    await expect(response).rejects.toThrow(new InfraError('infra_error'))
  })
})
