import Entity from '../../../shared/entities/Entity'
import { IAddress } from '../../address/entities/interfaces.entity'
import { IBusiness } from '../../business/entities/interfaces.entity'
import { IFeatures } from '../../contracts/entities/interfaces'
import { IMenuEntity } from '../../menus/entities/menu.entity'
import { ISuperBusiness } from '../../superbusinesses/entities/interfaces.entities'

export type IPrinterType = '58mm' | '80mm'

export interface IStockControlMode {
  type?: string
  minValueWarning?: number
}

export type IOrderType = 'Físico' | 'Online'
export type IPaymentType = 'Cartão de Crédito' | 'Dinheiro' | 'Cartão de Débito'

export interface IDayOfWork {
  dayName?: string
  initialTime?: Date
  finalTime?: Date
}

export interface IQRCode {
  dotStyle?: string
  dotColor?: string
}

export interface DeliveryFee {
  _id?: any
  maxDistance?: number
  value?: number
}

export interface NeighborhoodFee {
  _id?: any
  neighborhood?: number
  value?: number
}

export interface IEpisode extends Entity {
  name?: string
  status?: string
  orderIdleTime?: number
  stopedTemporary?: boolean
  business?: IBusiness
  orderNumberCounter?: number
  printerType?: IPrinterType
  stockControlMode?: IStockControlMode
  orderTypes?: Array<IOrderType>
  paymentTypes?: Array<IPaymentType>
  pixKey?: string
  menus?: Array<IMenuEntity> | string[]
  daysOfWork?: Array<IDayOfWork>
  minValueOrder?: number
  hasCollabTip?: boolean
  qrcode?: IQRCode
  active?: boolean
  paused?: boolean
  collaboratorsPassword?: string
  enableDelivery?: string
  enableGrabAndGo?: string
  deliveryFees?: Array<DeliveryFee>
  neighborhoodFees?: Array<NeighborhoodFee>
  superBusiness?: ISuperBusiness
  hasNotMap?: boolean
  createdAt?: Date
  updatedAt?: Date
  color?: string
  logo?: string
  address?: IAddress
  publicKey?: string
  placeId?: string
  isItWorkingNow?: boolean
  hasStockController?: boolean
  features?: IFeatures
  stayingConfig?: {
    type: string
  }
  contractId?: string
  expireTrial?: Date
  shortLink?: string
  ownLink?: string
  notifyMotoboyNewOrders?: boolean
  notifyMotoboyOrdersReady?: boolean
  plan?: string
  initialListMode?: string
  prepMessagingToken?: string
}

export interface IRevenues {
  total?: number
  totalCount?: number
  finishedTotal?: number
  finishedCount?: number
  pendingTotal?: number
  pendingCount?: number
  cancelledTotal?: number
  cancelledCount?: number
  avgTicketTotal?: number
}

export interface IDeliveryTypes {
  deliveryCount?: number
  deliveryTotal?: number
  takeawayCount?: number
  takeawayTotal?: number
  localCount?: number
  localTotal?: number
}

export interface IPaymentTypes {
  pixCount?: number
  pixTotal?: number
  moneyCount?: number
  moneyTotal?: number
  creditCardCount?: number
  creditCardTotal?: number
  debitCardCount?: number
  debitCardTotal?: number
}

export interface ITaxAndDiscounts {
  total?: number
  deliveryTaxTotal?: number
  serviceTaxTotal?: number
  promotionTotal?: number
  cardTaxTotal?: number
  discountTotal?: number
}

export interface IPodium {
  items: any[]
}

interface IStockViewItem {
  name: string
  totalQuantity: number
  quantity: number
  available: boolean
  'Estoque Definido': number
  'Estoque Atual': number
}
export interface IStockView {
  chart: IStockViewItem[]
}
