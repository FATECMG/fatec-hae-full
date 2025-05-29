import { IPlanEntity } from '../../entities/plan.entity'

export interface IPlanRepository {
  find: () => Promise<IPlanEntity[]>
  getOne?(id: string, projection?: string): Promise<IPlanEntity>
  findOne?(
    filter: any,
    projection?: string,
    populate?: any,
  ): Promise<IPlanEntity>
}
