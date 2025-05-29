import Joi from 'joi'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import {
  generateError,
  generateValidResult,
} from '../../../../shared/utils/validations'
import { IEpisode } from '../../entities/interfaces'

const EpisodeJoi = Joi.object({
  _id: Joi.string().required(),
  logo: Joi.string().required(),
})

export class ValidateUpdateEpisodeLogoUseCase
  implements ValidationSchema<IEpisode> {
  async validate(episode: IEpisode): Promise<ValidationResult<IEpisode>> {
    const result = EpisodeJoi.validate(episode)
    if (result.error) {
      return result
    }

    if (!episode.logo.startsWith('data')) {
      return generateError('logo must be a valid base64 string')
    }
    return generateValidResult(episode)
  }
}
