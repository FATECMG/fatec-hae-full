import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../shared/utils/validations'
import { Request } from 'express'

export class GetEpisodeByCollabHttpValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.query.episode || !(req.query as any).episode._id) {
      return generateError('episode is missing in request query')
    }
    return generateValidResult(req)
  }
}
