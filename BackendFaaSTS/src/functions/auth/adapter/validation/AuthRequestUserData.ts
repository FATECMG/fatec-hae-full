import { ValidationError } from '@common/error/ValidationError'
import { type NewValidationSchema } from '@common/validation/Validate'
import { injectable } from 'inversify'
import { z } from 'zod'

const requestSchema = z.object({
  accessToken: z.string().nonempty()
})

@injectable()
export class RequestUserDataValidation implements NewValidationSchema {
  validate (args: any): undefined | ValidationError {
    const parsedData = requestSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
