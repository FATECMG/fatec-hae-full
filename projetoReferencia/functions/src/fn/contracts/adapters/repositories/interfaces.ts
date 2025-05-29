import { FilterQuery } from 'mongoose'
import { IContract } from '../../entities/interfaces'

export interface IContractRepository {
  create?(contract: IContract): Promise<IContract>
  findOne?(
    filter: FilterQuery<IContract>,
    projection?: any,
    populate?: any,
  ): Promise<IContract>
  list?(filter: any, projection?: string, populate?: any): Promise<Array<any>>
  updateMany?(filter: any, set: any, populate?: any): Promise<Array<IContract>>
  updateById?(id: string, set: any, populate?: any): Promise<IContract>
}
