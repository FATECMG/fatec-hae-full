import { type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Project } from '@functions/project/entities/Project'
import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'
@injectable()
export class DeactivateProjectUseCase implements DeactivateUseCase<Project> {
  constructor (
    @inject(ProjectRepositoryLocator.DeactivateProjectRepository) private readonly deactivate: DeactivateEntityRepository<Project>
  ) {}

  async execute (id: string): Promise<{ deleted: boolean, message: string }> {
    const result = await this.deactivate.perform(id)
    return result ? { deleted: result, message: 'Excluido com sucesso' } : { deleted: result, message: 'Não foi possível excluir, tente novamente mais tarde!' }
  }
}
