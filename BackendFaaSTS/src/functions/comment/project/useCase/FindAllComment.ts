import { FindAllFromEntityRepository } from '@common/repository/RepositoryInterface'
import { type FindAllFromEntityUseCase } from '@common/domain/UseCase.interface'

import { CommentProjectRepositoryLocator } from '@functions/comment/project/shared/Di.enums'
import { type Comment } from '@functions/comment/project/entities/Comment'

import { inject, injectable } from 'inversify'

@injectable()
export class FindAllCommentsFromProjectUseCase implements FindAllFromEntityUseCase<Comment> {
  constructor (@inject(CommentProjectRepositoryLocator.FindAllCommentsFromProjectRepository)
  readonly findOne: FindAllFromEntityRepository<Comment>
  ) { }

  async execute (id: string): Promise<Comment[]> {
    const result = await this.findOne.perform(id)
    return result.length === 0 ? [] : result
  }
}
