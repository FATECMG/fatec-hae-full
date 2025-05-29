import { inject, injectable } from 'inversify'
import { ICountedList } from '../../../shared/adapters/repositories/interfaces'
import { IBusinessRepository } from '../adapters/repositories/interfaces.repository'
import { IBusiness } from '../entities/interfaces.entity'
import { Locator } from '../shared/di.enums'
import { IBusinessUseCase } from './interfaces.usecases'

@injectable()
export class BusinessUseCase implements IBusinessUseCase {
  constructor(
    @inject(Locator.BusinessRepository) private repo: IBusinessRepository,
  ) {}

  async list(
    filters?: any,
    projection?: string,
    limit?: number,
    offset?: number,
    populate?: any,
  ): Promise<ICountedList<IBusiness>> {
    const result = await this.repo.list(
      filters,
      projection,
      limit,
      offset,
      populate,
    )
    return result
  }

  async getOne(id: string, projection?: string): Promise<IBusiness> {
    const user = await this.repo.findOne(id, projection, {
      path: 'contract',
      select: 'features',
    })
    user.password = undefined
    return user
  }

  async checkCPF(cpf: string): Promise<boolean> {
    const business = await this.repo.checkUserExistsByParams({
      cpf,
      email: 'zzz',
    })

    if (business === null) return false
    return true
  }

  async checkEmail(email: string): Promise<boolean> {
    const business = await this.repo.checkUserExistsByParams({
      cpf: 'zzz',
      email,
    })

    if (business === null) return false
    return true
  }

  async listFeatures(business: IBusiness): Promise<string[]> {
    console.log(business)
    const loadedBusiness = await this.repo.findOne(business._id, 'contracts', {
      path: 'contract',
      select: 'features extraFeatures',
    })

    const allFeatures = [
      ...loadedBusiness.contract.features,
      ...loadedBusiness.contract.extraFeatures,
    ]

    return allFeatures
  }
}
