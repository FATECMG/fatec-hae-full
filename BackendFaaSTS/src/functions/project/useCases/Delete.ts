import { type DeleteResult, type DeleteUseCase } from '@common/domain/UseCase.interface'
import { DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeleteProjectUseCase implements DeleteUseCase {
  /**
   * Creates a new instance of the `DeleteProjectUseCase` class.
   * @param {DeleteEntityRepository} deleteOne - The repository that deletes the `Project` entity.
   */
  constructor (
    @inject(ProjectRepositoryLocator.DeleteProjectRepository) private readonly deleteOne: DeleteEntityRepository
  ) {}

  /**
   * Executes the use case to delete a `Project` entity by its ID.
   * @param {string} id - The ID of the entity to delete.
   * @returns {Promise<DeleteResult>} A `Promise` that resolves to a `DeleteResult` object.
   */
  async execute (id: string): Promise<DeleteResult> {
    const result = await this.deleteOne.perform(id)
    return result ? { deleted: result, message: 'Excluído com sucesso' } : { deleted: result, message: 'Não foi possível excluir, tente novamente mais tarde!' }
  }
}
