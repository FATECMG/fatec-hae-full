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

import { container } from '../../../business/shared/di.container'
import { IBusinessRepository } from '../../../business/adapters/repositories/interfaces.repository'
import { Locator } from '../../../business/shared/di.enums'

const EpisodeJoi = Joi.object({
  name: Joi.string(),
  business: Joi.object({
    id: Joi.string().required(),
  }).required(),
  orderNumberCounter: Joi.number(),
  printerType: Joi.string().valid('58mm', '80mm'),
  stockControlMode: Joi.object({
    type: Joi.string(),
    minValueWarning: Joi.number(),
  }),
  orderTypes: Joi.array().items(Joi.string().valid('Físico', 'Online')),
  paymentTypes: Joi.array().items(
    Joi.string().valid('Cartão de Crédito', 'Dinheiro', 'Cartão de Débito'),
  ),
  menus: Joi.array().items(
    Joi.object({
      id: Joi.string(),
    }),
  ),
  daysOfWork: Joi.array().items(
    Joi.object({
      dayName: Joi.string(),
      initialTime: Joi.string(),
      finalTime: Joi.string(),
    }),
  ),
  hasCollabTip: Joi.boolean(),
  qrcode: Joi.object({
    dotStyle: Joi.string(),
    dotColor: Joi.string(),
  }),
  active: Joi.boolean(),
  paused: Joi.boolean(),
  collaboratorsPassword: Joi.string(),
  enableDelivery: Joi.boolean(),
  enableGrabAndGo: Joi.boolean(),
  deliveryFees: Joi.array().items(
    Joi.object({
      maxDistance: Joi.number(),
      value: Joi.number(),
    }),
  ),
  superBusiness: Joi.object({
    id: Joi.string(),
  }),
  color: Joi.string(),
  logo: Joi.string(),
  address: Joi.object({
    street: Joi.string(),
    number: Joi.string(),
    complement: Joi.string(),
    neighborhood: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postCode: Joi.string(),
    placeId: Joi.string().required(),
    text: Joi.string().required(),
  }).required(),
})

export class ValidateEpisodeUseCase implements ValidationSchema<IEpisode> {
  constructor() {
    this.businessRepository = container.get(Locator.BusinessRepository)
  }
  private businessRepository: IBusinessRepository

  async validate(episode: IEpisode): Promise<ValidationResult<IEpisode>> {
    const result = EpisodeJoi.validate(episode)
    if (result.error) {
      return result
    }
    try {
      const business = await this.businessRepository.checkBusinessExists(
        episode.business.id,
      )
      if (!business || !business.active) {
        return generateError('Business não existe.')
      }
    } catch (err) {
      console.log(err)
      return generateError('Não conseguimos checar o business.')
    }
    return generateValidResult(episode)
  }
}
