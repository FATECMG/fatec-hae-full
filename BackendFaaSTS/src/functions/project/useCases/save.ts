import { SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'

import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'

import { inject, injectable } from 'inversify'

/**
 * Represents a use case for saving a project entity.
 * @implements {SaveUseCase<Project>}
 */
@injectable()
export class SaveProjectUseCase implements SaveUseCase<Project> {
  /**
     * Creates an instance of SaveProjectUseCase.
     * @param {SaveEntityRepository<Project>} repository - The repository used to save the project entity.
     */
  constructor (
    @inject(ProjectRepositoryLocator.SaveProjectRepository) private readonly repository: SaveEntityRepository<Project>
  ) { }

  /**
     * Executes the use case to save a project entity.
     * @param {Project} param - The project entity to be saved.
     * @returns {Promise<Project | Error>} - The saved project entity or an error if the operation fails.
     */
  async execute (param: Project): Promise<Project | Error> {
    try {
      const result = await this.repository.perform(param)
      return result
    } catch (err) {
      if (err instanceof DuplicatedFieldError) {
        return err
      }
      return new InfraError('Erro inesperado!')
    }
  }
}
