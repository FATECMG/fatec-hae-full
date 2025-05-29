import { ValidationError } from '@common/error/ValidationError'
import { type NewValidationSchema } from '@common/validation/Validate'
import { injectable } from 'inversify'
import { z } from 'zod'

const generatePostUrlDTOZodValidation = z.object({
  resourceId: z.string({
    required_error: 'O ID do recurso é obrigatório!',
    invalid_type_error: 'O ID do recurso deve ser uma string!'
  }),
  files: z.array(z.object({
    name: z.string({
      required_error: 'O nome do arquivo é obrigatório!',
      invalid_type_error: 'O nome do arquivo deve ser uma string!'
    }),
    type: z.string({
      required_error: 'O tipo do arquivo é obrigatório!',
      invalid_type_error: 'O tipo do arquivo deve ser uma string!'
    })
  })),
  resourceType: z.string({
    required_error: 'O tipo do recurso é obrigatório!',
    invalid_type_error: 'O tipo do recurso deve ser uma string!'
  })
})

@injectable()
export class GeneratePostUrlDTOZodValidation implements NewValidationSchema {
  /**
   * Validates a PostURLRequest object using the Zod library.
   * @param args - The PostURLRequest object to be validated.
   * @returns undefined if the object is valid, or a ValidationError object if the object is invalid.
   */
  validate (args: any): undefined | ValidationError {
    const parsedData = generatePostUrlDTOZodValidation.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
