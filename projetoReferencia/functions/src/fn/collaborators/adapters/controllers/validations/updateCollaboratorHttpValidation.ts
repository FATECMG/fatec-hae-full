import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'

export class UpdateCollaboratorHttpValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    const { collaborator: id } = req.params || {}
    if (!id) return generateError('invalid collaborator id')

    return generateValidResult(req)
  }
}
