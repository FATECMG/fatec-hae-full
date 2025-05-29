import { type HttpResponse } from '@common/http/Types'
import { GetPoliciesController } from '@functions/passwordvalidation/controller/GetPoliciesController'
import { type PoliciesPM } from '@functions/passwordvalidation/entities/PasswordPolicyPM'

const getController = new GetPoliciesController()

export const GetPoliciesHandler = async (): Promise<HttpResponse<PoliciesPM>> => {
  const response = await getController.handle()
  return { data: response.data, statusCode: response.statusCode }
}
