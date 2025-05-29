
import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'
import { type FindAllController } from '@common/domain/Controllers'
import { type School } from '@functions/school/entities/School'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const schoolController = schoolContainer.get<FindAllController<School, SchoolPM>>(SchoolLocator.SchoolFindAllController)

/**
 * @returns Código 200 com um array de objetos de várias escolas dentro da propriedade body.
 * Mesmo que o caso de uso não retorne nenhuma escola, o handler ainda sim retornará 200 e um array vazio.
 */
const getSchoolsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  let active: boolean = true
  if (event?.queryStringParameters !== null && event.queryStringParameters.active !== undefined) {
    active = event.queryStringParameters.active !== 'false'
  }
  const response = await schoolController.handle(active)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getSchools = middyfy(getSchoolsHandler)
