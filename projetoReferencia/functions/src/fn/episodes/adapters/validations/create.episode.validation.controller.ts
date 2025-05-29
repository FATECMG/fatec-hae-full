import { Request } from 'express'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../shared/utils/validations'

export class ValidateCreateEpisodeController
  implements ValidationSchema<Request> {
  async validate(request: Request): Promise<ValidationResult<Request>> {
    if (!request.body || !request.body.episode) {
      return generateError('missing episode in request body')
    }
    return generateValidResult(request)
  }
}
