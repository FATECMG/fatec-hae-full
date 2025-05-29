import { UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { IDNotFoundError, NotFoundError } from '@common/error/NotFoundError'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { type UpdateUseCase } from '@common/domain/UseCase.interface'

import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'

import { inject, injectable } from 'inversify'

/**
 * Represents the use case for updating a project entity.
 * @implements {UpdateUseCase<Project>}
 */
@injectable()
export class UpdateProjectUseCase implements UpdateUseCase<Project> {
  /**
     * Creates an instance of UpdateProjectUseCase.
     * @param {UpdateEntityRepository<Project>} update - The repository responsible for updating a project entity.
     */
  constructor (
    @inject(ProjectRepositoryLocator.UpdateProjectRepository) private readonly update: UpdateEntityRepository<Project>
  ) {
  }

  /**
     * Executes the use case for updating a project entity.
     * @param {string} id - The ID of the project entity to be updated.
     * @param {Project} entity - The updated project entity.
     * @returns {Promise<Project | Error>} - The updated project entity or an error if the update fails.
     */
  async execute (id: string, entity: Project): Promise<Project | Error> {
    try {
      const result = await this.update.perform(entity, id)
      return result !== undefined ? result : new IDNotFoundError(id, 'projeto')
    } catch (error) {
      if (error instanceof DuplicatedFieldError || error instanceof NotFoundError) { return error }
    }
    return new InfraError('Erro inesperado!')
  }
}
