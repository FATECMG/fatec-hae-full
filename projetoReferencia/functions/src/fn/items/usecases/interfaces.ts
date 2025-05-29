import { IItemEntity } from '../entities/item.entity'

export interface IItemUseCase {
  updateItem?(item: IItemEntity): Promise<IItemEntity>
  getItem?(id: string): Promise<IItemEntity>
}
