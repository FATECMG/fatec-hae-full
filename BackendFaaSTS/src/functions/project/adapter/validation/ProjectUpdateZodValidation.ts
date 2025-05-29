import { type NewValidationSchema } from '@common/validation/Validate'
import { ValidationError } from '@common/error/ValidationError'

import { z } from 'zod'
import { injectable } from 'inversify'

const projectUpdateDTOSchema = z.object({
  author: z.object({
    id: z.string({ required_error: 'Id do autor é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }),
    name: z.string({ required_error: 'Nome do autor é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' })
  }),
  notice: z.object({
    id: z.string({ required_error: 'Id do edital é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }),
    title: z.string({ required_error: 'Título do edital é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' })
  }),
  title: z.string({ required_error: 'Nome do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(3).max(100),
  description: z.string({ required_error: 'Descrição do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(20).max(850),
  topicsOfInterest: z.array(z.string({ required_error: 'Tópico de interesse do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(3).max(50)).nonempty(),
  objectives: z.string({ required_error: 'Objetivos do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(20).max(850),
  methodology: z.string({ required_error: 'Metodologia do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(20).max(850),
  references: z.string({ required_error: 'Referências do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(20).max(850),
  justification: z.string({ required_error: 'Justificativa do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(20).max(850),
  schedule: z.string({ required_error: 'Cronogramas de atividades é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(3).max(850),
  hours: z.object({
    proposed: z.string({ required_error: 'Horas propostas do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(1),
    approved: z.string({ required_error: 'Horas aprovadas do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(1)
  }),
  complianceModel: z.string({ required_error: 'Modelo de cumprimento do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(3).max(50),
  status: z.string({ required_error: 'Status do projeto é obrigatório!', invalid_type_error: 'Tipo de dado inválido. Tipo de dado requerido: Caracteres!' }).min(1),
  active: z.optional(z.boolean())
})

@injectable()
export default class ProjectUpdateDTOZodValidation implements NewValidationSchema {
  /**
   * Validates a `ProjectUpdateDTO` object using the `zod` library.
   * @param {any} args - The `ProjectUpdateDTO` object to validate.
   * @returns {undefined|ValidationError} `undefined` if the object is valid, or a `ValidationError` object if the object is invalid.
   */
  validate (args: any): undefined | ValidationError {
    const parsedData = projectUpdateDTOSchema.safeParse(args)
    if (!parsedData.success) {
      return new ValidationError(parsedData.error.issues.map(eachIssue => ({ field: eachIssue.path[eachIssue.path.length - 1].toString(), message: eachIssue.message })))
    }
  }
}
