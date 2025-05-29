import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'
export class CollaboratorFindOneHttpValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    const { params, query } = req
    if (!params || !params.name) {
      return generateError('name is missing in params')
    }
    if (!query || !query.episode || (!query as any).episode?._id) {
      return generateError('episode is missing in query')
    }

    return generateValidResult(req)
  }
}
