import { Request } from 'express'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'

export class CreateMenuControllerValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.body || !req.body.business || !req.body.name || !req.body.items) {
      return generateError('req body is missing props')
    }
    return generateValidResult(req)
  }
}
