import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'

export class ListCollaboratorsByEpisodeHttpValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req.query || !req.query.episode) {
      return generateError('missing episode in query parameter')
    }
    return generateValidResult(req)
  }
}
