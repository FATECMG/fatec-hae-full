import { ICountedList } from '../../../shared/adapters/repositories/interfaces'
import { IBank, IBusiness } from '../entities/interfaces.entity'

export interface ICreateUseCase {
  create: (business: IBusiness) => Promise<IBusiness>
}

export interface IBankUseCase {
  list?(): Promise<Array<IBank>>
}

export interface IBusinessUseCase {
  list?(
    filters?: any,
    projection?: string,
    limit?: number,
    offset?: number,
    pupulate?: any,
  ): Promise<ICountedList<IBusiness>>
  getOne?(id: string, projection?: string): Promise<IBusiness>
  checkCPF?(cpf: string): Promise<boolean>
  checkEmail?(email: string): Promise<boolean>
  listFeatures?(business: IBusiness): Promise<string[]>
}
