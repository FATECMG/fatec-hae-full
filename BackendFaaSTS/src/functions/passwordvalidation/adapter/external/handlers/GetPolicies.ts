import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'
import { GetPoliciesController } from '@functions/passwordvalidation/controller/GetPoliciesController'

const controller = new GetPoliciesController()
const getPoliciesHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (_event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const response = await controller.handle()
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getPolicies = middyfy(getPoliciesHandler)
