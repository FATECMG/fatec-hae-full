import { type FindAllFromEntityUseCase } from '@common/domain/UseCase.interface'
import { FindAllFromEntityRepository } from '@common/repository/RepositoryInterface'

import { ProjectRepositoryLocator } from '@functions/project/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'
import { orderProjectBySendDate } from '@functions/project/utils/orderProjectBySendDate'

import { injectable, inject } from 'inversify'

@injectable()
export class FindAllProjectFromUserUseCase implements FindAllFromEntityUseCase<Project> {
  constructor (@inject(ProjectRepositoryLocator.FindAllProjectsFromUserIdRepository)
  readonly findAll: FindAllFromEntityRepository<Project>
  ) { }

  async execute (id: string): Promise<Project[]> {
    return orderProjectBySendDate(await this.findAll.perform(id))
  }
}
