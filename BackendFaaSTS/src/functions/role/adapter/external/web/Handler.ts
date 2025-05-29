import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { RoleContainer } from '@functions/role/shared/Di.container'
import { type RoleController } from '@functions/role/controller/RoleController'
import { RoleLocator } from '@functions/role/shared/Di.enums'

const controller = RoleContainer.get<RoleController>(RoleLocator.RoleController)

const getRoleslHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (_event, _context) => {
  _context.callbackWaitsForEmptyEventLoop = false

  const response = await controller.handle()

  return formatJSONResponse({
    body: response.data
  }, response.statusCode)
}

export const getRoles = middyfy(getRoleslHandler)
