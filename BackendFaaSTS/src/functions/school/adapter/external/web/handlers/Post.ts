import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type SaveController } from '@common/domain/Controllers'

import { type School } from '@functions/school/entities/School'
import { SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'
import type schema from '@functions/school/adapter/external/web/Schema'

const schoolController = schoolContainer.get<SaveController<SchoolDTO, School, SchoolPM>>(SchoolLocator.SchoolCreateController)

/**
 * @returns
 * Código 201 com o objeto da nova escola criada dentro da propriedade body.
 *
 * @returns
 * Código 400 com uma mensagem de erro no body quando o DTO enviado no corpo da requisição não consegue passar pela validação.
 */
const postSchoolHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  const request = event.body
  context.callbackWaitsForEmptyEventLoop = false
  const param = new SchoolDTO({
    name: request.name,
    address: {
      postCode: request.address.postCode,
      city: request.address.city,
      complement: request.address.complement,
      street: request.address.street,
      number: request.address.number,
      district: request.address.district,
      state: request.address.state
    }
  })
  const response = await schoolController.handle(param)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const postSchool = middyfy(postSchoolHandler)
