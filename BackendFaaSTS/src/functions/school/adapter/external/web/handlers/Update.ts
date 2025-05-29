import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type UpdateController } from '@common/domain/Controllers'

import { type School } from '@functions/school/entities/School'
import { SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'
import type schema from '@functions/school/adapter/external/web/Schema'

const schoolController = schoolContainer.get<UpdateController<SchoolDTO, School, SchoolPM>>(SchoolLocator.SchoolUpdateController)
/**
 * @returns
 * Código 200 com o objeto da nova escola atualizada dentro da propriedade body.
 *
 * @returns
 * Retorna código 400 em dois casos possíveis:
 * - O primeiro é quando o corpo da requisição não consegue passar pela validação.
 * - O segundo quando não é possível atualizar a escola.
 */
const putSchoolHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, _context) => {
  const id = event?.pathParameters?.id
  const request = event.body
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const param = new SchoolDTO({
    name: request.name,
    active: request.active,
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
  const response = await schoolController.handle(param, id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const putSchool = middyfy(putSchoolHandler)
