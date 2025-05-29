import { ValidationError } from '@common/error/ValidationError'
import { type NewValidationSchema } from '@common/validation/Validate'
import { injectable } from 'inversify'
import { z } from 'zod'

const createReportDTOZodValidation = z.object({
  projectId: z.string({
    required_error: 'O ID do projeto é obrigatório!',
    invalid_type_error: 'O ID do projeto deve ser uma string!'
  }),
  activities:
      z.array(
        z.object({
          description: z.string({
            required_error: 'A descrição da atividade é obrigatória!',
            invalid_type_error: 'A descrição da atividade deve ser uma string!'
          })
        })
      ).nonempty({
        message: 'É necessário pelo menos uma atividade!'
      })
})

@injectable()
export class CreateReportDTOZodValidation implements NewValidationSchema {
  /**
   * Validates a ReportDTO object using the Zod library.
   * @param args - The ReportDTO object to be validated.
   * @returns undefined if the object is valid, or a ValidationError object if the object is invalid.
   */
  validate (args: any): undefined | ValidationError {
    const parsedData = createReportDTOZodValidation.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
