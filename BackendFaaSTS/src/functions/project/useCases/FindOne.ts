import { FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { IDNotFoundError } from '@common/error/NotFoundError'

import { type Project } from '@functions/project/entities/Project'
import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'
@injectable()
export class FindOneProjectUseCase implements FindOneUseCase<Project> {
  /**
     * Creates a new instance of the FindOneProjectUseCase.
     * @param {FindOneEntityRepository<Project>} findOne - The repository method to find a single project.
     */
  constructor (
    @inject(ProjectRepositoryLocator.FindOneProjectRepository) private readonly findOne: FindOneEntityRepository<Project>
  ) { }

  /**
     * Executes the use case to find a single project by ID.
     * @param {string} id - The ID of the project to find.
     * @returns {Promise<Project | Error>} - A promise that resolves to the found project or an error if not found.
     */
  async execute (id: string): Promise<Project | Error> {
    const result = await this.findOne.perform(id)
    return result === undefined ? new IDNotFoundError(id, 'projeto') : result
  }
}
