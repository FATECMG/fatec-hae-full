import { FindAllFromEntityUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindAllFromEntityController } from '@common/domain/Controllers'

import { type CommentPM } from '@functions/comment/project/entities/CommentPM'
import { CommentMapperLocator, CommentProjectUseCaseLocator } from '@functions/comment/project/shared/Di.enums'
import { type Comment } from '@functions/comment/project/entities/Comment'

import { inject, injectable } from 'inversify'
@injectable()
export class HandleFindAllCommentsFromProjectController extends FindAllFromEntityController<Comment, CommentPM> {
  constructor (
    @inject(CommentProjectUseCaseLocator.FindAllCommentsFromProjectUseCase) readonly findOneUseCase: FindAllFromEntityUseCase<Comment>,
    @inject(CommentMapperLocator.CommentMapper) readonly PMFromEntity: Mapper<Comment, CommentPM>
  ) {
    super(PMFromEntity, findOneUseCase)
  }
}
