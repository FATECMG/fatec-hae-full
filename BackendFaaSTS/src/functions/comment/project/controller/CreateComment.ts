import { UpdateController } from '@common/domain/Controllers'
import { UpdateUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { NewValidationSchema } from '@common/validation/Validate'

import { type Comment } from '@functions/comment/project/entities/Comment'
import { type CommentDTO } from '@functions/comment/project/entities/CommentDTO'
import { type CommentPM } from '@functions/comment/project/entities/CommentPM'
import { CommentMapperLocator, CommentProjectSchemaValidationLocator, CommentProjectUseCaseLocator } from '@functions/comment/project/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class HandleCreateCommentController extends UpdateController<CommentDTO, Comment, CommentPM> {
  constructor (
  @inject(CommentProjectUseCaseLocator.CreateCommentProjectUseCase) updateUseCase: UpdateUseCase<Comment>,
    @inject(CommentProjectSchemaValidationLocator.CommentDTONewValidationSchema) dtoValidator: NewValidationSchema,
    @inject(CommentMapperLocator.CommentMapper) entityFromDTOMapper: Mapper<CommentDTO, Comment>,
    @inject(CommentMapperLocator.CommentPresentationModelMapper) PMFromEntity: Mapper<Comment, CommentPM>
  ) {
    super(dtoValidator, entityFromDTOMapper, PMFromEntity, updateUseCase)
  }
}
