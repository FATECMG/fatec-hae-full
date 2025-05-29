import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { type User } from '@functions/user/entities/User'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { toDomain } from '@functions/user/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

/**
 * Implementation of the FindOneEntityRepository interface that finds a single User entity in a MongoDB database.
 */
@injectable()
export class FindOneUserMongoRepository implements FindOneEntityRepository<User> {
  /**
   * Finds a single User entity in a MongoDB database.
   * @param id - The ID of the User entity to be found.
   * @returns A Promise that resolves to a User object if found, or undefined if not found.
   */
  async perform (id: string): Promise<User | undefined> {
    await connectDatabase()
    const result = await UserModel.findOne({ id })
    return result === null ? undefined : toDomain(result)
  }
}
