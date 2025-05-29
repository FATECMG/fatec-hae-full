import { ProjectDependencies } from '@libs/Inversify'

import { type FindAllFromEntityController } from '@common/domain/Controllers'

import { type Comment } from '@functions/comment/project/entities/Comment'
import { type CommentPM } from '@functions/comment/project/entities/CommentPM'
import { CommentProjectControllerLocator } from '@functions/comment/project/shared/Di.enums'
import { type HttpResponse } from '@common/http/Types'

const getController = ProjectDependencies.get<FindAllFromEntityController<Comment, CommentPM>>(CommentProjectControllerLocator.FindAllCommentsFromProjectController)

export const GetAllCommentHandler = async (id?: string): Promise<HttpResponse<CommentPM[] | string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
