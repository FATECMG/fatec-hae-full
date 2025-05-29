import { type ActivateUseCase } from '@common/domain/UseCase.interface'
import { ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Project } from '@functions/project/entities/Project'
import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'
@injectable()
export class ActivateProjectUseCase implements ActivateUseCase<Project> {
  constructor (
    @inject(ProjectRepositoryLocator.ActivateProjectRepository) private readonly activate: ActivateEntityRepository<Project>
  ) {}

  async execute (id: string): Promise<{ deleted: boolean, message: string }> {
    const result = await this.activate.perform(id)
    return result ? { deleted: result, message: 'Ativado com sucesso' } : { deleted: result, message: 'Não foi possível ativar, tente novamente mais tarde!' }
  }
}
