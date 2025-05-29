import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllEntityWithFilterRepository } from '@common/repository/RepositoryInterface'

import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { type Project } from '@functions/project/entities/Project'
import { toDomain } from '@functions/project/adapter/repositories/MongoDB/utils'

import { injectable } from 'inversify'
import { type ProjectFilter } from '../../external/web/filter/ProjectFilter'

/**
 * A repository class that finds all `Project` entities.
 */
@injectable()
export class FindAllProjectRepository implements FindAllEntityWithFilterRepository<Project, ProjectFilter> {
  /**
   * Finds all `Project` entities.
   * @returns {Promise<Project[]>} A `Promise` that resolves to an array of `Project` objects.
   */
  async perform (params: ProjectFilter): Promise<Project[]> {
    await connectDatabase()
    const result = await ProjectModel.find({
      $and: [
        { active: params.active },
        { status: { $in: params.status } }
      ]
    })
    return result.map(eachDoc => toDomain(eachDoc))
  }
}
