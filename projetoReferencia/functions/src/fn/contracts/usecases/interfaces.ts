import { IContract } from '../entities/interfaces'

export interface IContractUseCases {
  create?(contract?: IContract): Promise<IContract>
  endTrials?(contract: IContract): Promise<void>
  deactivateContract?(contract: IContract): Promise<IContract>
  cancelContract?(contract: IContract): Promise<IContract>
  manageContracts?(): Promise<IContract>
}

export interface IContractDetails {
  exec(body: IContractDetailsBody): Promise<IContractDetailsResponse>
}
export interface IContractDetailsBody {
  business: string
}

export interface IContractDetailsResponse {
  plan: {
    name: string
    id: string
  }
  status: string
  statusToDisplay: string
  expireTrial?: Date
  cancelDate?: Date
  price?: number
  discount?: number
  subscription?: string
  nextBillingDate?: string
  creditcard?: {
    brand: string
    preview: string
  }
  nextPayment?: {
    date: Date
    price: number
    planName: string
  }
  lastPayment?: string
  paymentError?: {
    date: Date
    message: string
  }
}
