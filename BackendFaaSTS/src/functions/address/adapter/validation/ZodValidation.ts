import { ValidationError } from '@common/error/ValidationError'
import { type NewValidationSchema } from '@common/validation/Validate'

import { injectable } from 'inversify'
import { z } from 'zod'

/**
 * A Zod schema that validates a Brazilian postal code.
 * The schema requires the postal code to be a string with 8 digits.
 * @type {z.ZodString}
 */
const cepSchema: z.ZodString = z.string().trim().min(8, 'CEP deve ter 8 caracteres! EX: 12345678').max(8, 'CEP deve ter 8 caracteres! EX: 12345678').regex(/\d{8}/, 'Formatação inválida! Deve seguir o modelo: 12345678')

/**
 * Implementation of the NewValidationSchema interface that validates a Brazilian postal code using the Zod library.
 */
@injectable()
export class CepZodValidation implements NewValidationSchema {
  /**
   * Validates a Brazilian postal code using the Zod library.
   * @param args - An object containing the postal code to be validated.
   * @param args.cep - A string representing a Brazilian postal code.
   * @returns `undefined` if the postal code is valid, or a `ValidationError` object if it is invalid.
   */
  validate (args: any): undefined | ValidationError {
    const parsedData = cepSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => {
        return { field: 'cep', message: eachIssue.message }
      }))
    }
  }
}
