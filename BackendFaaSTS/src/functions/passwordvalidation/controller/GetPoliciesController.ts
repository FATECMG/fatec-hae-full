import { type HttpResponse } from '@common/http/Types'
import { ok } from '@common/http/Helpers'

import { GetPoliciesUseCase } from '@functions/passwordvalidation/usecases/GetPolicies'
import { type PoliciesPM } from '@functions/passwordvalidation/entities/PasswordPolicyPM'
import { PasswordPolicyMapper } from '@functions/passwordvalidation/adapter/mapper/PasswordPolicyMapper'

export class GetPoliciesController {
  private readonly getPoliciesUseCase: GetPoliciesUseCase
  private readonly policiesMapper: PasswordPolicyMapper
  constructor () {
    this.getPoliciesUseCase = new GetPoliciesUseCase()
    this.policiesMapper = new PasswordPolicyMapper()
  }

  async handle (): Promise<HttpResponse<PoliciesPM>> {
    try {
      const response = await this.getPoliciesUseCase.execute()
      const policiesPM = await this.policiesMapper.execute(response)
      return ok(policiesPM)
    } catch (error: any) {
      return error
    }
  }
}
