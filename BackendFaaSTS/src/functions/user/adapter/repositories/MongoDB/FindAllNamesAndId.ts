import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { type UserNameAndId } from '@functions/user/entities/User'

import { injectable } from 'inversify'

/**
 * Implementation of the FindAllEntityRepository interface that finds all User, specifically the `name` and `id`, entities in a MongoDB database.
 */
@injectable()
export class FindAllUserNamesAndIdMongoRepository implements FindAllEntityRepository<UserNameAndId> {
  /**
   * Finds all User entities in a MongoDB database that contain the given `name` and `id`.
   * @returns A Promise that resolves to an array of UserNameAndId objects.
   * @see UserNameAndId
   */
  async perform (active: boolean): Promise<UserNameAndId[]> {
    await connectDatabase()
    const result = await UserModel.find({ active }, { name: 1, id: 1, _id: 0 })
    return result.map(eachDoc => {
      const { id, name } = eachDoc
      return { id, name }
    })
  }
}
