import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { validate } from '../../../shared/decorators/validate'
import { DomainError } from '../../../shared/errors/domain.error'
import { IPlanRepository } from '../../plans/adapters/repositories/types'
import { IContractRepository } from '../adapters/repositories/interfaces'
import { IContract } from '../entities/interfaces'
import { Locator } from '../shared/di.enums'
import { IContractUseCases } from './interfaces'
import { CreateContractUseCaseValidation } from './validations/create.contract.usecase.validation'

@injectable()
export class ContractUseCase implements IContractUseCases {
  constructor(
    @inject(Locator.ContractRepository) private repository: IContractRepository,
    @inject(Locator.PlansRepository) private plansRepo: IPlanRepository,
    @inject(Locator.DisableContractExternal)
    private disableContractExternal: IExternal<string, void>,
  ) {}
  @validate(new CreateContractUseCaseValidation())
  async create(contract: IContract): Promise<IContract> {
    const createdContract = await this.repository.create(contract)
    return createdContract
  }

  async endTrials(contract: IContract): Promise<void> {
    const freePlan = await this.plansRepo.findOne({ isFree: true })
    if (!freePlan) {
      throw new DomainError({
        errorCode: '002 - contract',
        message: 'Não há plano grátis disponível.',
      })
    }
    await this.repository.updateById(contract._id, {
      status: 'FREE',
      features: freePlan.features,
      plan: {
        id: freePlan._id,
        name: freePlan.name,
      },
    })
  }

  async deactivateContract(contract: IContract): Promise<IContract> {
    const freePlan = await this.plansRepo.findOne({ isFree: true })
    if (!freePlan) {
      throw new DomainError({
        errorCode: '002 - contract',
        message: 'Não há plano grátis disponível.',
      })
    }

    const updatedContract = await this.repository.updateById(contract._id, {
      status: 'DISABLED',
      features: freePlan.features,
    })

    return updatedContract
  }

  async cancelContract(contract: IContract): Promise<IContract> {
    const freePlan = await this.plansRepo.findOne({ isFree: true })
    if (!freePlan) {
      throw new DomainError({
        errorCode: '002 - contract',
        message: 'Não há plano grátis disponível.',
      })
    }

    const updatedContract = await this.repository.updateById(contract._id, {
      status: 'CANCELED',
      cancelDate: new Date(),
      features: freePlan.features,
    })

    return updatedContract
  }

  async manageContracts(): Promise<IContract> {
    const contracts = await this.repository.list(
      {
        expireTrial: {
          $lt: new Date(),
        },
        status: 'TRIAL',
      },
      '_id plan status',
      {
        path: 'plan.id',
        match: {
          isFree: {
            $ne: true,
          },
        },
      },
    )

    if (!contracts || !contracts.length) return

    const endTrials = contracts.filter(c => c.plan.id)

    for (const contract of endTrials) {
      try {
        await this.disableContractExternal.call(contract._id)
      } catch (error) {
        console.error(error)
      }
    }

    return {}
  }
}
