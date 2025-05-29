import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'
import { Request } from 'express'
export class GetEpisodeDeliveryTypesHttpValidaton
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    console.log(req.query)
    if (
      !req.query ||
      !req.query.filters ||
      !req.params ||
      !req.params.episode
    ) {
      return generateError('missing query parameters')
    }
    return generateValidResult(req)
  }
}
