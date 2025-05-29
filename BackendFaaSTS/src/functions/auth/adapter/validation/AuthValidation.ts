import { ValidationError } from '@common/error/ValidationError'
import { type NewValidationSchema } from '@common/validation/Validate'

import { injectable } from 'inversify'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string({ required_error: 'Email é obrigatório!' }).nonempty().email(),
  password: z.string({ required_error: 'Senha é obrigatório!' }).min(6)
})

@injectable()
export class AuthZodValidation implements NewValidationSchema {
  validate (args: any): undefined | ValidationError {
    const parsedData = authSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
