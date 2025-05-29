import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'

import { injectable } from 'inversify'

/**
 * A repository class that deletes a `Project` entity by its ID.
 */
@injectable()
export class DeleteProjectRepository implements DeleteEntityRepository {
  /**
   * Deletes a `Project` entity by its ID.
   * @param {string} id - The ID of the entity to delete.
   * @returns {Promise<boolean>} A `Promise` that resolves to a `boolean` indicating whether the entity was deleted.
   */
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const projectDeleted = await ProjectModel.findOneAndDelete({ id })
    return projectDeleted !== null
  }
}
