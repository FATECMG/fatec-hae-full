import Joi from 'joi'
import { add } from 'date-fns'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import { IContract } from '../../entities/interfaces'
import {
  generateError,
  generateValidResult,
} from '../../../../shared/utils/validations'
import { container as planContainer } from '../../../plans/shared/di.container'
import { container as businessContainer } from '../../../business/shared/di.container'
import { IPlanRepository } from '../../../plans/adapters/repositories/types'
import { Locator as PlanLocator } from '../../../plans/shared/di.enums'
import { Locator as BusinessLocator } from '../../../business/shared/di.enums'
import { IBusinessRepository } from '../../../business/adapters/repositories/interfaces.repository'
const ContractJoi = Joi.object({
  business: Joi.object({
    id: Joi.string().required(),
  }).required(),
  plan: Joi.object({
    id: Joi.object({
      id: Joi.string().required(),
    }),
    name: Joi.string(),
  }).required(),
})

export class CreateContractUseCaseValidation
  implements ValidationSchema<IContract> {
  constructor() {
    this.planRepository = planContainer.get<IPlanRepository>(
      PlanLocator.PlanRepository,
    )
    this.businessRepository = businessContainer.get<IBusinessRepository>(
      BusinessLocator.BusinessRepository,
    )
  }
  planRepository: IPlanRepository
  businessRepository: IBusinessRepository
  async validate(contract: IContract): Promise<ValidationResult<IContract>> {
    const result = ContractJoi.validate(contract)
    if (result.error) {
      return result
    }
    try {
      const loadedBusiness = await this.businessRepository.checkBusinessExists(
        contract.business.id,
      )

      if (!loadedBusiness) {
        return generateError('Não encontramos o business.')
      }
      contract.business = loadedBusiness
    } catch (err) {
      console.log(err)
      return generateError('Não conseguimos checar o business.')
    }

    try {
      const loadedPlan = await this.planRepository.getOne(
        contract.plan.id?.id,
        'name isFree price features',
      )
      if (!loadedPlan) {
        return generateError('Plano não foi encontrado.')
      }

      contract.plan = {
        name: loadedPlan.name,
        id: loadedPlan,
      }
      contract.price = loadedPlan.price
      contract.features = loadedPlan.features
      if (loadedPlan.isFree) {
        contract.status = 'FREE'
      } else {
        contract.status = 'TRIAL'
        const date = new Date()
        const expireTrial = add(date, { days: 15 })
        contract.expireTrial = expireTrial
      }
    } catch (err) {
      console.log(err)
      return generateError('Não conseguimos encontrar o plano.')
    }

    return generateValidResult(contract)
  }
}
