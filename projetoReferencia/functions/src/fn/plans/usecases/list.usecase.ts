import { inject, injectable } from 'inversify'
import { IPlanRepository } from '../adapters/repositories/types'
import { IPlanEntity } from '../entities/plan.entity'
import { Locator } from '../shared/di.enums'

export interface IListPlans {
  list: () => Promise<IPlanEntity[]>
}

@injectable()
export class ListPlans implements IListPlans {
  constructor(
    @inject(Locator.PlanRepository) readonly repository: IPlanRepository,
  ) {}

  async list(): Promise<IPlanEntity[]> {
    const plans = await this.repository.find()
    return plans
  }
}
