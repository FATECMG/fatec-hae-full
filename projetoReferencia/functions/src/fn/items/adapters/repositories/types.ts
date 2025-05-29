import { FilterQuery, UpdateQuery } from 'mongoose'
import { IItemEntity } from '../../entities/item.entity'

export interface IItemRepository {
  create: (item: IItemEntity) => Promise<IItemEntity>
  createMany: (items: IItemEntity[]) => Promise<IItemEntity[]>
  update: (
    filter: FilterQuery<IItemEntity>,
    update: UpdateQuery<IItemEntity>,
  ) => Promise<IItemEntity>
  findOne: (
    filter: any,
    projection?: any,
    populate?: any,
  ) => Promise<IItemEntity>
  patch: (item: IItemEntity) => Promise<IItemEntity>
  find: (params: {
    filters: any
    limit: number
    offset: number
  }) => Promise<IItemEntity[]>
  count: (params: any) => Promise<number>
}
