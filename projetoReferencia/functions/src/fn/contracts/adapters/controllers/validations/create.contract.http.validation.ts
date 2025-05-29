import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'

export class CreateContractHttpValidation implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.body || !req.body.contract) {
      return generateError('contract is missing in request body')
    }

    return generateValidResult(req)
  }
}
