import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'
export class ValidateLoginHttp implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.headers || !req.headers.authorization) {
      return generateError('Authorization header is missing')
    }
    return generateValidResult(req)
  }
}
