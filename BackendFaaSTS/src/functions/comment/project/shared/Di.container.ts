import { Container } from 'inversify'

import { type UpdateController, type FindAllFromEntityController } from '@common/domain/Controllers'
import { type UpdateUseCase, type FindAllFromEntityUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type UpdateEntityRepository, type FindAllFromEntityRepository } from '@common/repository/RepositoryInterface'
import { type NewValidationSchema } from '@common/validation/Validate'

import { CommentMapper, CommentPresentationModelMapper } from '@functions/comment/project/adapter/mapper/Comment.mapper'
import { CreateCommentProjectMongoRepository } from '@functions/comment/project/adapter/repositories/MongoDB/CreateComment'
import { FindAllCommentsFromProjectRepository } from '@functions/comment/project/adapter/repositories/MongoDB/FindAllComments'
import CommentZodValidation from '@functions/comment/project/adapter/validation/CommentZodValidation'
import { HandleCreateCommentController } from '@functions/comment/project/controller/CreateComment'
import { HandleFindAllCommentsFromProjectController } from '@functions/comment/project/controller/FindAllComment'
import { type Comment } from '@functions/comment/project/entities/Comment'
import { type CommentDTO } from '@functions/comment/project/entities/CommentDTO'
import { type CommentPM } from '@functions/comment/project/entities/CommentPM'
import { CreateCommentProjectUseCase } from '@functions/comment/project/useCase/CreateComment'
import { FindAllCommentsFromProjectUseCase } from '@functions/comment/project/useCase/FindAllComment'
import {
  CommentProjectRepositoryLocator,
  CommentProjectUseCaseLocator,
  CommentMapperLocator,
  CommentProjectControllerLocator,
  CommentProjectSchemaValidationLocator
} from '@functions/comment/project/shared/Di.enums'

export const commentContainer = new Container()

commentContainer
  .bind<UpdateEntityRepository<Comment>>(CommentProjectRepositoryLocator.CreateCommentProjectRepository)
  .to(CreateCommentProjectMongoRepository)

commentContainer
  .bind<UpdateUseCase<Comment>>(CommentProjectUseCaseLocator.CreateCommentProjectUseCase)
  .to(CreateCommentProjectUseCase)

commentContainer
  .bind<Mapper<CommentDTO, Comment>>(CommentMapperLocator.CommentMapper)
  .to(CommentMapper)

commentContainer
  .bind<Mapper<Comment, CommentPM>>(CommentMapperLocator.CommentPresentationModelMapper)
  .to(CommentPresentationModelMapper)

commentContainer
  .bind<NewValidationSchema>(CommentProjectSchemaValidationLocator.CommentDTONewValidationSchema)
  .to(CommentZodValidation)

commentContainer
  .bind<UpdateController<CommentDTO, Comment, CommentPM>>(CommentProjectControllerLocator.CreateCommentProjectController)
  .to(HandleCreateCommentController)

commentContainer
  .bind<FindAllFromEntityRepository<Comment>>(CommentProjectRepositoryLocator.FindAllCommentsFromProjectRepository)
  .to(FindAllCommentsFromProjectRepository)

commentContainer
  .bind<FindAllFromEntityUseCase<Comment>>(CommentProjectUseCaseLocator.FindAllCommentsFromProjectUseCase)
  .to(FindAllCommentsFromProjectUseCase)

commentContainer
  .bind<FindAllFromEntityController<Comment, CommentPM>>(CommentProjectControllerLocator.FindAllCommentsFromProjectController)
  .to(HandleFindAllCommentsFromProjectController)
