import Joi from 'joi'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import { generateValidResult } from '../../../../shared/utils/validations'
import { ICollaborator } from '../../entities/interfaces'

const CollaboratorJoi = Joi.object({
  _id: Joi.string(),
  name: Joi.string(),
  episode: Joi.object({
    _id: Joi.string().required(),
  }).required(),
})

export class CollaboratorFindOneValidation
  implements ValidationSchema<ICollaborator> {
  async validate(
    collaborator: ICollaborator,
  ): Promise<ValidationResult<ICollaborator>> {
    const result = CollaboratorJoi.validate(collaborator)
    if (result.error) {
      return result
    }

    return generateValidResult(collaborator)
  }
}
