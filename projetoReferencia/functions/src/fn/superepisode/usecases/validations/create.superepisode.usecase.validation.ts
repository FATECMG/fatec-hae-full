import Joi from 'joi'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import { ISuperEpisode } from '../../entities/interfaces'

const SuperEpisodeJoi = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  episodes: Joi.array().items(Joi.string().required()),
  id: Joi.string(),
  color: Joi.string(),
}).required()

export class CreateSuperEpisodeUseCaseValidation
  implements ValidationSchema<ISuperEpisode> {
  async validate(
    superEpisode: ISuperEpisode,
  ): Promise<ValidationResult<ISuperEpisode>> {
    return SuperEpisodeJoi.validate(superEpisode)
  }
}
