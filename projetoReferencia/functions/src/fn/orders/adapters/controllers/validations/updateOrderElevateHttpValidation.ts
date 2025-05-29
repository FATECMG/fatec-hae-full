import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'
export class UpdateOrderElevateHttpValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.body.order || !req.body.who) {
      return generateError('order or who not present in request body')
    }

    return generateValidResult(req)
  }
}
