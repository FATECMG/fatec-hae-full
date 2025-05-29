import { type NewValidationSchema } from '@common/validation/Validate'
import { ValidationError } from '@common/error/ValidationError'

import { RoleEnum } from '@functions/user/entities/User'

import { z } from 'zod'
import { injectable } from 'inversify'

const userDTOSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(10),
  phone: z.string().min(1),
  registerNumber: z.string().min(4).max(20),
  roles: z.string().min(1),
  active: z.optional(z.boolean()),
  academicTitle: z.enum(['GRADUADO', 'PÓS-GRADUADO', 'MESTRADO', 'DOUTORADO', 'NENHUMA'])
})

const courseArraySchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string().min(1)
  })
).min(1)

const userUpdateDTOSchema = userDTOSchema.omit({ password: true })

function verifyCourse (args: any): ValidationError | undefined {
  if (roleMustHaveCourses(args)) {
    const courseParsedData = courseArraySchema.safeParse(args.courses)

    if (!courseParsedData.success) {
      return new ValidationError([{ field: 'courses', message: 'Verifique se o campo courses está correto.' }])
    }
  }
}

const roleMustHaveCourses = (args: any): boolean => args.roles === RoleEnum.COORDINATOR || args.roles === RoleEnum.PROFESSOR

const isValidationError = (possibleError: any): possibleError is ValidationError => possibleError instanceof ValidationError

/**
 * Implementation of the NewValidationSchema interface that validates a UserDTO object using the Zod library.
 */
@injectable()
export class UserUpdateDTOZodValidation implements NewValidationSchema {
  /**
   * Validates a UserDTO object using the Zod library.
   * @param args - The UserDTO object to be validated.
   * @returns undefined if the object is valid, or a ValidationError object if the object is invalid.
   */
  validate (args: any): undefined | ValidationError {
    const parsedData = userUpdateDTOSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
    const possibleCourseErrors = verifyCourse(args)
    if (isValidationError(possibleCourseErrors)) return possibleCourseErrors
  }
}

/**
 * Implementation of the NewValidationSchema interface that validates a UserUpdateDTO object using the Zod library.
 */
@injectable()
export class UserDTOZodValidation implements NewValidationSchema {
  /**
   * Validates a UserUpdateDTO object using the Zod library.
   * @param args - The UserUpdateDTO object to be validated.
   * @returns undefined if the object is valid, or a ValidationError object if the object is invalid.
   */
  validate (args: any): undefined | ValidationError {
    const parsedData = userDTOSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
    const possibleCourseErrors = verifyCourse(args)
    if (isValidationError(possibleCourseErrors)) return possibleCourseErrors
  }
}
