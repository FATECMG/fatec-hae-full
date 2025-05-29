import { connectDatabase } from '@common/external/database/MongoDB'

import { Role } from '@functions/role/entities/Role'
import { type IRoleRepository } from '@functions/role/adapter/repositories/RoleRepository'
import { type RoleDocument, RoleModel } from '@functions/role/adapter/repositories/model/RoleMongoModel'

import { injectable } from 'inversify'

@injectable()
export class RoleRepository implements IRoleRepository {
  /**
   * Finds all `Role` entities.
   * @returns {Promise<Role[]>} A `Promise` that resolves to an array of `Role` objects.
   */
  async findAll (): Promise<Role[]> {
    await connectDatabase()
    const rolesDb = await RoleModel.find({ active: true })
    return rolesDb.map(eachDoc => this.toDomain(eachDoc))
  }

  /**
   * Converts a `RoleDocument` object to a `Role` object.
   * @param {RoleDocument} doc - The `RoleDocument` object to convert.
   * @returns {Role} The converted `Role` object.
   * @private
   */
  private toDomain (doc: RoleDocument): Role {
    return new Role({
      name: doc.name,
      active: doc.active
    }, doc.id)
  }
}
