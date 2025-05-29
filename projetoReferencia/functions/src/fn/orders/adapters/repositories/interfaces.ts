import { FilterQuery } from 'mongoose'
import { IOrder } from '../../entities/interfaces'

export interface IOrdersRepository {
  getById?(_id: string, projection?: string, populate?: any): Promise<IOrder>
  list?(
    filter: FilterQuery<IOrder>,
    projection?: string,
    populate?: any,
  ): Promise<Array<IOrder>>
  count?(filter: any): Promise<number>
  updateOrder?(order: IOrder): Promise<IOrder>
  updateManyOrderItems?(order: IOrder): Promise<IOrder>
  createOrder?(order: IOrder): Promise<IOrder>
}
