import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'

export class GetEpisodeIdByShortLinkHttpValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.query || !req.query?.shortlink) {
      return generateError('shortlink missing in query parameter')
    }
    return generateValidResult(req)
  }
}
