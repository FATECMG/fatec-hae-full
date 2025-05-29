import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'
export class ComposeByPlaceIdControllerValidation
  implements ValidationSchema<Request> {
  async validate(req: Request): Promise<ValidationResult<Request>> {
    let error
    if (!req || !req.params || !req.params.placeId) {
      error = {
        message: 'No placeId provided',
      }
    }
    return { value: req, error }
  }
}
