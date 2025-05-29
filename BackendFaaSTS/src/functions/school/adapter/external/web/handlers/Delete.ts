import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type DeleteController } from '@common/domain/Controllers'

import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const schoolController = schoolContainer.get<DeleteController>(SchoolLocator.SchoolDeleteController)

/**
 * @returns
 * Código 204 quando a operação de exclusão é concluída com sucesso.
 *
 * @returns
 * Código 400 com uma mensagem de erro no body quando não é possível excluir nenhuma escola.
 */
const deleteSchoolHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await schoolController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const deleteSchool = middyfy(deleteSchoolHandler)
