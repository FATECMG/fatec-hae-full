import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type FindOneController } from '@common/domain/Controllers'

import { type School } from '@functions/school/entities/School'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const schoolController = schoolContainer.get<FindOneController<School, SchoolPM>>(SchoolLocator.SchoolFindOneController)

/**
 * @returns
 * Código 200 com o objeto da escola dentro da propriedade body quando é encontrado alguma escola.
 *
 * @returns
 * Código 404 com uma mensagem de erro no body quando não é encontrada nenhuma escola.
 */
const getSchoolHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
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

export const getSchool = middyfy(getSchoolHandler)
