import { type NewValidationSchema } from '@common/validation/Validate'
import { ValidationError } from '@common/error/ValidationError'

import { z } from 'zod'
import { injectable } from 'inversify'

/**
 * Zod schema that defines the constraints for a CourseDTO object.
 * @property {string} name - The name of the course. Must be a non-empty string.
 * @property {boolean} [active] - Whether the course is active. Optional boolean value.
 * @property {string} coordinator - The name of the course coordinator. Must be a non-empty string.
 * @property {string[]} schedule - An array of strings representing the course schedule. Must be non-empty and have at least one element.
 * @property {string} code - The code of the course. Must be a non-empty string.
 * @property {string} acronym - The acronym of the course. Must be a non-empty string.
 */
const courseDTOSchema = z.object({
  name: z.string().nonempty(),
  active: z.optional(z.boolean()),
  coordinator: z.string().nonempty(),
  schedule: z.array(z.enum(['Matutino', 'Vespertino', 'Noturno'])).nonempty().min(1),
  code: z.string().nonempty(),
  acronym: z.string().nonempty()
})

/**
 * Implementation of the ValidationSchema interface that validates a CourseDTO object using the Zod library.
 */
@injectable()
export class CourseZodValidation implements NewValidationSchema {
  /**
   * Validates a CourseDTO object using the Zod library.
   * @param dto - A CourseDTO object to be validated.
   * @returns `true` if the CourseDTO object is valid, or `false` if it is invalid.
   */
  validate (args: any): undefined | ValidationError {
    const parsedData = courseDTOSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
