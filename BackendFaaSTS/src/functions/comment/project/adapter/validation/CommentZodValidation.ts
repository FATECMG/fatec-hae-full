import { ValidationError } from '@common/error/ValidationError'
import { type NewValidationSchema } from '@common/validation/Validate'

import { injectable } from 'inversify'
import { z } from 'zod'

export const CommentDTOSchema = z.object({
  author: z.object({
    id: z.string({ required_error: 'Author id is required' }).trim().nonempty(),
    name: z.string({ required_error: 'Author name is required' }).trim().nonempty()
  }),
  content: z.string({ required_error: 'Content is required' }).trim().nonempty()
})

@injectable()
export default class CommentZodValidation implements NewValidationSchema {
  /**
   * Validates a `CommentDTO` object using the `zod` library.
   * @param {any} args - The `CommentDTO` object to validate.
   * @returns {undefined|ValidationError} `undefined` if the object is valid, or a `ValidationError` object if the object is invalid.
   */
  validate (args: any): undefined | ValidationError {
    const parsedData = CommentDTOSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
