import { ICountedList } from '../../../../shared/adapters/repositories/interfaces'
import { ILogin } from '../../../login/entities/interfaces'
import { IBusiness } from '../../entities/interfaces.entity'

export interface IBusinessRepository {
  create?: (business: IBusiness) => Promise<IBusiness>
  checkAdminExists?: (id: string) => Promise<IBusiness>
  checkBusinessExists?: (id: string) => Promise<IBusiness>
  checkUserExistsByParams?(params: {
    email: string
    cpf: string
  }): Promise<IBusiness>
  loginUser?(type: string, login?: ILogin): Promise<IBusiness>
  list?(
    filters?: any,
    projection?: string,
    limit?: number,
    offset?: number,
    populate?: any,
  ): Promise<ICountedList<IBusiness>>
  findOne?(id: string, projection?: string, populate?: any): Promise<IBusiness>
  findOneByParams?(
    filters?: any,
    projection?: string,
    populate?: any,
  ): Promise<IBusiness>
  update?(id: string, body: IBusiness): Promise<IBusiness>
}
