import { ProjectDependencies } from '@libs/Inversify'

import { type HttpResponse } from '@common/http/Types'
import { type UpdateController } from '@common/domain/Controllers'
import { type FieldError } from '@common/error/ValidationError'

import { CommentDTO } from '@functions/comment/project/entities/CommentDTO'
import { type Comment } from '@functions/comment/project/entities/Comment'
import { type CommentPM } from '@functions/comment/project/entities/CommentPM'
import { CommentProjectControllerLocator } from '@functions/comment/project/shared/Di.enums'

const patchController = ProjectDependencies.get<UpdateController<CommentDTO, Comment, CommentPM>>(CommentProjectControllerLocator.CreateCommentProjectController)

export const PatchCreateCommentHandler = async (request: any, id?: string): Promise<HttpResponse<string | CommentPM | FieldError | FieldError[]>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const param = new CommentDTO({
    author: request.author,
    content: request.content
  })
  const response = await patchController.handle(param, id)
  return { data: response.data, statusCode: response.statusCode }
}
