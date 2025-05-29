import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllFromEntityRepository } from '@common/repository/RepositoryInterface'
import { type Project } from '@functions/project/entities/Project'
import { ProjectModel } from './model/ProjectModel'
import { toDomain } from './utils'

import { injectable } from 'inversify'

@injectable()
export class FindAllProjectFromUserIdRepository implements FindAllFromEntityRepository<Project> {
  /**
   * Finds all `Project` entities from an user id.
   * @returns {Promise<Project[]>} A `Promise` that resolves to an array of `Project` objects.
   */
  async perform (id: string): Promise<Project[]> {
    await connectDatabase()
    const result = await ProjectModel.find({ 'author.id': id, active: true })
    return result.map(eachDoc => toDomain(eachDoc))
  }
}
