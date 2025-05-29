import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'
import { Request } from 'express'
export class GetEpisodeRevenuesHttpValidaton
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.query || !req.query.episode || !req.query.filters) {
      return generateError('missing query parameters')
    }
    return generateValidResult(req)
  }
}
