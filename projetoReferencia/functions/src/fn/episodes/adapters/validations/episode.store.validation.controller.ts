import { Request } from 'express'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../shared/utils/validations'

export class ValidateEpisodeForStore implements ValidationSchema<Request> {
  async validate(request: Request): Promise<ValidationResult<Request>> {
    if (!request.query || !request.query.episode) {
      return generateError('missing episode in request params')
    }
    return generateValidResult(request)
  }
}
