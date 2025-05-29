import { type IRoleRepository } from '@functions/role/adapter/repositories/RoleRepository'
import { type Role } from '@functions/role/entities/Role'
import { RoleLocator } from '@functions/role/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class RoleUseCases {
  /**
   * Creates a new instance of the `RoleUseCases` class.
   * @param {IRoleRepository} roleRepository - An instance of the `IRoleRepository` interface.
   */
  constructor (@inject(RoleLocator.RoleRepository) private readonly roleRepository: IRoleRepository) {}

  /**
   * Finds all `Role` entities.
   * @returns {Promise<Role[]>} A `Promise` that resolves to an array of `Role` objects.
   */
  async findAll (): Promise<Role[]> {
    return await this.roleRepository.findAll()
  }
}
