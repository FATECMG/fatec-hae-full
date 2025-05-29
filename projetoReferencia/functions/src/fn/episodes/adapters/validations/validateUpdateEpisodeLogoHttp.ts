import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../shared/utils/validations'

export class ValidateUpdateEpisodeLogoHttp
  implements ValidationSchema<Request> {
  async validate(request: Request): Promise<ValidationResult<Request>> {
    if (!request.body.episode) {
      return generateError('episode not found in request body')
    }
    return generateValidResult(request)
  }
}
