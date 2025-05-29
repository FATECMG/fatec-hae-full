import { ValidationError } from '@common/error/ValidationError'
import { type NewValidationSchema } from '@common/validation/Validate'

import { injectable } from 'inversify'
import { z } from 'zod'

const noticeDTOSchema = z.object({

  title: z.string({
    required_error: 'Nome do projeto é obrigatório!',
    invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
  }).trim().min(3).max(100).nonempty(),

  description: z.string({
    required_error: 'Descrição do projeto é obrigatório!',
    invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
  }).trim().min(20).max(850),

  topicsOfInterest: z.array(z.string({
    invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
  })).nonempty().min(1),

  openDate: z.string({
    required_error: 'Data de abertura do projeto é obrigatório!',
    invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
  }).trim().nonempty(),

  closeDate: z.string({
    required_error: 'Data de fechamento do projeto é obrigatório!',
    invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
  }).trim().nonempty(),

  evaluationEndDate: z.string({
    required_error: 'Data de encerramento da avaliação do projeto é obrigatório!',
    invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
  }).trim().nonempty(),

  semester: z.string({
    required_error: 'Semestre do projeto é obrigatório!',
    invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
  }).trim().nonempty(),

  year: z.string({
    required_error: 'Ano do projeto é obrigatório!',
    invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
  }).trim().nonempty(),

  course: z.optional(
    z.object({
      id: z.string({
        required_error: 'Id do curso é obrigatório!',
        invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
      }).trim().nonempty(),
      name: z.string({
        required_error: 'Nome do curso é obrigatório!',
        invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!'
      }).trim().nonempty()
    })
  ),

  active: z.optional(z.boolean())
})

@injectable()
export default class NoticeDTOZodValidation implements NewValidationSchema {
  validate (args: any): undefined | ValidationError {
    const parsedData = noticeDTOSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
