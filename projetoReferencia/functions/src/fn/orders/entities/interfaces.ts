import Entity from '../../../shared/entities/Entity'
import { ICollaborator } from '../../collaborators/entities/interfaces'
import { IEpisode } from '../../episodes/entities/interfaces'
import { IItemEntity } from '../../items/entities/item.entity'

export interface Option {
  name?: string
  observation?: string
  description?: string
  hasPhotos?: boolean
  photos?: Array<string>
  price?: number
  alias?: string
  prepareEnv?: string
  itemRef?: IItemEntity
}

export interface Complement {
  quantity?: number
  name?: string
  description?: string
  hasPhotos?: boolean
  photos?: Array<string>
  price?: number
  alias?: string
  prepareEnv?: string
  itemRef?: IItemEntity
}

export interface OrderItem {
  _id?: string
  name?: string
  price?: number
  description?: string
  type?: string
  quantity?: number
  hasPhotos?: boolean
  observation?: string
  photos?: Array<string>
  alias?: string
  status?: string
  prepareEnv?: string
  itemRef?: IItemEntity
  label?: string
  options?: Array<Option>
  complements: Array<Complement>
}

export interface Customer {
  name?: string
  address?: {
    postCode?: string
    number?: string
    street?: string
    neighborhood?: string
    city?: string
    state?: string
  }
  cpf?: string
  phone?: string
}

export interface IOrder extends Entity {
  discount?: number
  price?: number
  episode?: IEpisode
  orderItems?: Array<OrderItem>
  deliveryType?: string
  deliveryAddress?: {
    text?: string
    placeId?: string
  }
  deliveryFee?: {
    _id?: any
    deliveryFeeRef?: string
    value?: number
  }
  hasCollabTip?: boolean
  collabTip?: number
  status?: string
  orderNumber?: number
  orderTime?: number
  deliveryTime?: number
  active?: boolean
  paymentType?: string
  change?: number
  type?: string
  customer?: Customer
  observation?: string
  collaborator?: {
    _id?: string
  }
  deliverCollaborator?: ICollaborator
  tableNumber?: string
  zelpaycard?: number
  paymentSplit?: Array<{
    type?: string
    value?: number
  }>
  nfce?: {
    _id?: string
  }
  messagingToken?: string
  approvedAt?: Date
  createdAt?: Date
  updatedAt?: Date
  canceledAt?: Date | string
  readyAt?: Date
  finishedAt?: Date | string
  traveledAt?: Date
  source?: string
  travelTime?: string
  wasUpdated?: boolean
}
