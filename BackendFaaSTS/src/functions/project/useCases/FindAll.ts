import { type FindAllWithFilterUseCase } from '@common/domain/UseCase.interface'
import { FindAllEntityWithFilterRepository } from '@common/repository/RepositoryInterface'

import { type Project } from '@functions/project/entities/Project'
import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'
import { type ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'
import { orderProjectBySendDate } from '@functions/project/utils/orderProjectBySendDate'

import { inject, injectable } from 'inversify'

/**
 * Use case that finds all projects.
 * @implements {FindAllUseCase<Project>}
 */
@injectable()
export class FindAllProjectUseCase implements FindAllWithFilterUseCase<Project, ProjectFilter> {
  /**
     * Creates a new instance of the FindAllProjectUseCase class.
     * @param {FindAllEntityRepository<Project>} findAll - The repository that finds all projects.
     */
  constructor (
    @inject(ProjectRepositoryLocator.FindAllProjectRepository) private readonly findAll: FindAllEntityWithFilterRepository<Project, ProjectFilter>
  ) {}

  /**
     * Executes the use case and returns all projects.
     * @returns {Promise<Project[]>} - A promise that resolves to an array of projects.
     */
  async execute (params: ProjectFilter): Promise<Project[]> {
    return orderProjectBySendDate(await this.findAll.perform(params))
  }
}
