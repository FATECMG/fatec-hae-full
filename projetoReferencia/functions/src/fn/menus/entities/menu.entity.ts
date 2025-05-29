import { IItemEntity } from '../../items/entities/item.entity'

export interface IMenuEntity {
  _id?: string
  name: string
  itemsPrice: ItemsPrice[]
  business: string
  active?: boolean
}

export type TypesOfConsumption = 'Consumo Local' | 'Retirada' | 'Delivery'
export interface ItemsPrice {
  order: number
  price: number
  discount?: number
  item: IItemEntity | string
  typesOfConsumption?: TypesOfConsumption[]
}
