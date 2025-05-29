import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'
import { Request } from 'express'
export class CheckBusinessCPFHttpValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.params || !req.params?.cpf) {
      return generateError('missing cpf in path params')
    }
    return generateValidResult(req)
  }
}
