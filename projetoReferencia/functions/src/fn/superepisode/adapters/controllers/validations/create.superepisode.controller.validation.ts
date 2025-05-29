import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
import { ValidateJWT } from '../../../../../shared/utils/validateJWT'
import {
  generateError,
  generateValidResult,
} from '../../../../../shared/utils/validations'
export class CreateSuperEpisodeControllerValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    if (!req || !req.body || !req.body.superEpisode) {
      return generateError('superepisode is missing in request body')
    }
    const validateJwt = new ValidateJWT()
    const result = await validateJwt.validate(req)
    if (result.error) {
      return result
    }
    return generateValidResult({
      ...req,
      decodedJwt: result.value.decoded,
    } as any)
  }
}
