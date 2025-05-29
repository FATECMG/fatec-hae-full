import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

import { type FindAllFromEntityController } from '@common/domain/Controllers'

import { type Comment } from '@functions/comment/project/entities/Comment'
import { type CommentPM } from '@functions/comment/project/entities/CommentPM'
import { CommentProjectControllerLocator } from '@functions/comment/project/shared/Di.enums'

const getCommentsController = ProjectDependencies.get<FindAllFromEntityController<Comment, CommentPM>>(CommentProjectControllerLocator.FindAllCommentsFromProjectController)
const getProjectCommentsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await getCommentsController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getProjectComments = middyfy(getProjectCommentsHandler)
