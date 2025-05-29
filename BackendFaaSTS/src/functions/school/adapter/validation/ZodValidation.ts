import { type NewValidationSchema } from '@common/validation/Validate'
import { ValidationError } from '@common/error/ValidationError'

import { z } from 'zod'
import { injectable } from 'inversify'

/**
 * A validation schema for the `SchoolDTO` class using the `zod` library.
 */
const schoolDTOSchema = z.object({
  name: z.string({ required_error: 'Nome é obrigatório!', invalid_type_error: 'Nome é obrigatório!' }).min(1, 'Nome não pode ser vazio!').max(100, 'Nome deve ter no máximo 100 caracteres!'),
  address: z.object({
    postCode: z.string({ required_error: 'CEP é obrigatório!', invalid_type_error: 'CEP é obrigatório!' }).trim().min(9, 'CEP deve ter 9 caracteres! EX: 12345-789').max(9, 'CEP deve ter 9 caracteres! EX: 12345-789').regex(/\d{5}-\d{3}/, 'Formatação inválida! Deve seguir o modelo: 12345-789'),
    street: z.string({ required_error: 'Rua é obrigatório!', invalid_type_error: 'Rua é obrigatório!' }).trim().min(1, 'Rua não pode ser vazio!'),
    city: z.string({ required_error: 'Cidade é obrigatório!', invalid_type_error: 'Cidade é obrigatório!' }).trim().min(1, 'Cidade não pode ser vazia!'),
    district: z.string({ required_error: 'Bairro é obrigatório!', invalid_type_error: 'Bairro é obrigatório!' }).trim().min(1, 'Bairro não pode ser vazio!'),
    number: z.optional(z.string({ required_error: 'Número é obrigatório!', invalid_type_error: 'Número é obrigatório!' }).trim().min(1, 'Número não pode ser vazio!')),
    complement: z.optional(z.string().trim().min(1, 'Complemento não pode ser vazio!')),
    state: z.string({ required_error: 'Estado é obrigatório!', invalid_type_error: 'Estado é obrigatório!' }).trim().min(2, 'Estado deve ter 2 caracteres apenas!').max(2, 'Estado deve ter 2 caracteres apenas!').regex(/^([^0-9]*)$/, 'Formatação inválida! Deve seguir o modelo: AB')
  }),
  active: z.optional(z.boolean())
})

/**
 * A validation class that implements the `NewValidationSchema` interface for the `SchoolDTO` class.
 */
@injectable()
export class SchoolDTOZodValidation implements NewValidationSchema {
  /**
    * Validates the input data against the `schoolDTOSchema` schema.
    * @param {any} args - The input data to validate.
    * @returns {undefined | ValidationError} `undefined` if the input data is valid, or a `ValidationError` object if the input data is invalid.
    */
  validate (args: any): undefined | ValidationError {
    const parsedData = schoolDTOSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
