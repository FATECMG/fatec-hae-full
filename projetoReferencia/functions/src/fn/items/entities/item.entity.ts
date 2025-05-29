import Entity from '../../../shared/entities/Entity'

export interface IItemEntity extends Entity {
  _doc?: IItemEntity
  _id?: string
  key?: string
  name?: string
  alias?: string
  price?: number
  description?: string
  photos?: string[]
  subItems?: SubItem[]
  complements?: Complement[]
  tributeInfos?: TributeInfos
  prepareTime?: number
  type?: string
  hasPhotos?: boolean
  active?: boolean
  business?: string
  observations?: string[]
  hasNew?: boolean
  prepareEnv?: string
  stockControl?: string
  stock?: Stock
  typesOfConsumption?: string[]
}

export interface Complement {
  item?: IItemEntity | string
  price?: number
}

export interface SubItem {
  isComposite?: boolean
  question?: string
  selectQuantity?: number
  selectMinQuantity?: number
  options?: ItemOption[]
  complements?: ItemOption[]
}

export interface ItemOption {
  item?: IItemEntity
  price?: number
}

export interface Stock {
  available?: boolean
  quantity?: number
  totalQuantity?: number
}

export interface TributeInfos {
  ncm?: string
  cfop?: string
  valor?: number
  valorUnitario: {
    comercial: number
    tributabel: number
  }
  tributos: {
    icms: {
      origem: string
      cst: string
      baseCalculo: {
        modalidadeDeterminacao: number
        valor: number
      }
      aliquota: number
      valor: number
    }
    pis: {
      cst: string
      baseCalculo: {
        valor: number
        quantidade: number
      }
      aliquota: number
      valor: number
    }
    cofins: {
      cst: string
      baseCalculo: {
        valor: number
      }
      aliquota: number
      valor: number
    }
  }
}
