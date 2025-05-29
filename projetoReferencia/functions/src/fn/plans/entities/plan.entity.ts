import Entity from '../../../shared/entities/Entity'
import { IFeatures } from '../../contracts/entities/interfaces'

export interface PlanPromotion {
  params: string
  startDate: Date
  endDate: Date
  price: number
}

export interface IPlanEntity extends Entity {
  _id?: string
  name?: string
  price?: number
  active?: boolean
  promotions?: PlanPromotion[]
  createdAt?: Date
  updatedAt?: Date
  isFree?: boolean
  features?: IFeatures
}
