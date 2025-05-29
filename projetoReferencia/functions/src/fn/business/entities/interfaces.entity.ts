import Entity from '../../../shared/entities/Entity'
import { IContract } from '../../contracts/entities/interfaces'

export interface AddressInterface {
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  postCode?: string
  cep?: string
}

export interface CommonDocument {
  id: string
  status: string
  approvalStatus?: string
}

export interface MissingDocumentsEmbedded {
  documents: CommonDocument[]
}

export interface MissingDocuments {
  _embedded: MissingDocumentsEmbedded
}
export interface Bank {
  number?: string
  account?: string
  agency?: string
}

export interface TransferDetail {
  transferDate?: Date
  amount?: number
  status?: string
}

export type TransferHistory = TransferDetail[]

export interface IBusiness extends Entity {
  email?: string
  password?: string
  name?: string
  firestoreUid?: string
  resourceToken?: string
  paymentId?: string
  paymentPublicKey?: string
  document?: CommonDocument
  selfie?: CommonDocument
  companyDoc?: CommonDocument
  cnpj?: string
  cpf?: string
  phone?: string
  businessArea?: number
  linesOfBusiness?: string
  companyType?: string
  birthDate?: Date
  type?: string
  bank?: Bank
  customer_id?: string
  creditcard?: {
    creditCardId?: string
    last4CardNumber?: string
    expirationMonth?: string
    expirationYear?: string
  }
  createdBy?: {
    text: string
    user?: IBusiness
  }
  address?: {
    text?: string
    placeId?: string
  } & AddressInterface
  transfersHistory?: TransferHistory
  contract?: IContract
}

export interface IBank {
  name?: string
  number?: string
}
