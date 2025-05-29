import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { connectDatabase } from '@common/external/database/MongoDB'

import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { type Project } from '@functions/project/entities/Project'
import { toDomain } from '@functions/project/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'

/**
 * A repository class that finds a `Project` entity by its ID.
 */
@injectable()
export class FindOneProjectRepository implements FindOneEntityRepository<Project> {
  /**
   * Finds a `Project` entity by its ID.
   * @param {string} id - The ID of the entity to find.
   * @returns {Promise<Project | undefined>} A `Promise` that resolves to a `Project` object or `undefined` if the entity was not found.
   */
  async perform (id: string): Promise<Project | undefined> {
    await connectDatabase()
    const result = await ProjectModel.findOne({ id }, { _id: 0, __v: 0 })
    return result === null ? undefined : toDomain(result)
  }
}
