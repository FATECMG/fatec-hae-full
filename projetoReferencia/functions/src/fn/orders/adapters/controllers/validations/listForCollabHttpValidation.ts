import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'
export class ListForCollabHttpValidation implements ValidationSchema<Request> {
  async validate(request: Request): Promise<ValidationResult<Request>> {
    if (!request.query.episode) {
      return generateError('episode is missing in request query')
    }
    return generateValidResult(request)
  }
}
