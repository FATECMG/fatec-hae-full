import Entity from '../../../shared/entities/Entity'
import { IBusiness } from '../../business/entities/interfaces.entity'
import { IPlanEntity } from '../../plans/entities/plan.entity'

export type IFeatures = Array<
  'menu' | 'prepare_env' | 'delivery' | 'qrcode' | 'dash' | 'stock' | 'nfce'
>
export type IStatuses =
  | 'FREE'
  | 'TRIAL'
  | 'ACTIVE'
  | 'CANCELED'
  | 'PENDING'
  | 'DISABLED'
export interface IInteractions {
  date?: Date
  description?: string
  source?: string
}

export interface ISeller {
  id?: string
}
export interface IContract extends Entity {
  business?: IBusiness
  features?: IFeatures
  extraFeatures?: IFeatures
  status?: IStatuses
  interactions?: IInteractions
  plan?: {
    id?: IPlanEntity
    name?: string
  }
  price?: number
  nextBillingDate?: Date
  discount?: number
  expireTrial?: Date
  cancelDate?: Date
  seller?: ISeller
  subscription?: string
  lastPayment?: Date
  paymentError?: {
    date?: Date
    message?: string
  }
}
