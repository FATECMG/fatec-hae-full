import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

import { type UpdateController } from '@common/domain/Controllers'

import type CommentSchema from '@functions/comment/project/adapter/external/web/CommentSchema'
import { CommentDTO } from '@functions/comment/project/entities/CommentDTO'
import { type Comment } from '@functions/comment/project/entities/Comment'
import { type CommentPM } from '@functions/comment/project/entities/CommentPM'
import { CommentProjectControllerLocator } from '@functions/comment/project/shared/Di.enums'

const createCommentController = ProjectDependencies.get<UpdateController<CommentDTO, Comment, CommentPM>>(CommentProjectControllerLocator.CreateCommentProjectController)
const createCommentHandler: ValidatedEventAPIGatewayProxyEvent<typeof CommentSchema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  const request = event.body

  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }

  const param = new CommentDTO({
    author: request.author,
    content: request.content
  })
  const response = await createCommentController.handle(param, id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const createProjectComment = middyfy(createCommentHandler)
