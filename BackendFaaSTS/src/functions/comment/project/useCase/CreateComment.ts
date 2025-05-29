import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { CommentError, CommentNotCreated } from '@common/error/CommentError'
import { InfraError } from '@common/error/InfraError'

import { CommentProjectRepositoryLocator } from '@functions/comment/project/shared/Di.enums'
import { type Comment } from '@functions/comment/project/entities/Comment'

import { inject, injectable } from 'inversify'

@injectable()
export class CreateCommentProjectUseCase implements UpdateUseCase<Comment> {
  constructor (
    @inject(CommentProjectRepositoryLocator.CreateCommentProjectRepository)
    private readonly create: UpdateEntityRepository<Comment>
  ) {}

  async execute (id: string, entity: Comment): Promise<Comment | Error> {
    try {
      const result = await this.create.perform(entity, id)
      return result !== undefined ? result : new CommentNotCreated()
    } catch (error) {
      if (error instanceof CommentError) { return error }

      return new InfraError('Erro inesperado!')
    }
  }
}
