import {
  ValidationResult,
  ValidationSchema,
} from '../../../../../shared/decorators/validate'
import { Request } from 'express'

export class CreateControllerValidation implements ValidationSchema<Request> {
  async validate(args: Request): Promise<ValidationResult<Request>> {
    let error
    if (!args || !args.body || !args.body.business) {
      error = {
        message: 'No business provided',
      }
    }
    return {
      value: args,
      error,
    }
  }
}
