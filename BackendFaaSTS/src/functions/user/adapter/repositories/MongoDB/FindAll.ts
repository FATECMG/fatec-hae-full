import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { type User } from '@functions/user/entities/User'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { toDomain } from '@functions/user/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

/**
 * Implementation of the FindAllEntityRepository interface that finds all User entities in a MongoDB database.
 */
@injectable()
export class FindAllUserMongoRepository implements FindAllEntityRepository<User> {
  /**
   * Finds all User entities in a MongoDB database.
   * @returns A Promise that resolves to an array of User objects.
   */
  async perform (active: boolean): Promise<User[]> {
    await connectDatabase()
    const result = await UserModel.find({ active })
    return result.map(eachDoc => toDomain(eachDoc))
  }
}
