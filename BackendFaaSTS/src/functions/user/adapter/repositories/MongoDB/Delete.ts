import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'

import { injectable } from 'inversify'

/**
 * Implementation of the DeleteEntityRepository interface that deletes a User entity from a MongoDB database.
 */
@injectable()
export class DeleteUserMongoRepository implements DeleteEntityRepository {
  /**
   * Deletes a User entity from a MongoDB database.
   * @param id - The ID of the User entity to be deleted.
   * @returns A Promise that resolves to a boolean indicating whether the entity was deleted successfully.
   */
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const deleted = await UserModel.findOneAndDelete({ id })
    return deleted !== null
  }
}
