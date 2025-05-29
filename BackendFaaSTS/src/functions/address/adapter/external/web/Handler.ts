import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type AddressController } from '@functions/address/controller/AddressController'
import { AddressLocator } from '@functions/address/shared/Di.enums'
import { AddressContainer } from '@functions/address/shared/Di.container'

const controller = AddressContainer.get<AddressController>(AddressLocator.AddressController)

const getAddressHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, _context) => {
  _context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Não foi encontrado um cep na requisição!'
    }, 404)
  }
  const response = await controller.handle(id)
  return formatJSONResponse({
    body: response.data
  }, response.statusCode)
}

export const getAddress = middyfy(getAddressHandler)
